"""Circuit breaker, per-source TTL, Redis cache backend, and fallback headers."""

import json
import sys
import types

from robo_market_search.shared import http as http_mod
from robo_market_search.shared.breaker import CircuitBreaker
from robo_market_search.shared.cache import RedisSearchCache, SearchCache, make_cache
from robo_market_search.shared.models import Product


def prod(store, name="ESP32"):
    return Product(name=name, price=10.0, currency="TL", url=f"http://{store}/{name}", store=store)


class Clock:
    def __init__(self):
        self.t = 0.0

    def __call__(self):
        return self.t


def test_breaker_opens_after_threshold_and_recovers():
    clock = Clock()
    b = CircuitBreaker(failure_threshold=2, reset_seconds=30, clock=clock)
    assert b.allow()
    b.record_failure()
    assert b.allow()
    b.record_failure()
    assert not b.allow()
    clock.t = 31
    assert b.allow()  # half-open probe
    assert not b.allow()  # only one probe at a time
    b.record_success()
    assert b.allow()


def test_breaker_half_open_failure_reopens():
    clock = Clock()
    b = CircuitBreaker(failure_threshold=1, reset_seconds=10, clock=clock)
    b.record_failure()
    clock.t = 11
    assert b.allow()
    b.record_failure()
    assert not b.allow()


def test_success_resets_failure_count():
    b = CircuitBreaker(failure_threshold=2, reset_seconds=10, clock=Clock())
    b.record_failure()
    b.record_success()
    b.record_failure()
    assert b.allow()


def test_ttl_is_min_across_sources(tmp_path):
    cache = SearchCache(db_path=str(tmp_path / "c.db"), default_ttl_seconds=100, source_ttls={"Fast": 5})
    assert cache.ttl_for([prod("Fast"), prod("Slow")]) == 5
    assert cache.ttl_for([prod("Slow")]) == 100
    assert cache.ttl_for([]) == 100


class FakeRedis:
    def __init__(self):
        self.data, self.ttls = {}, {}

    def get(self, k):
        return self.data.get(k)

    def setex(self, k, ttl, v):
        self.data[k], self.ttls[k] = v, ttl

    def delete(self, *ks):
        for k in ks:
            self.data.pop(k, None)


def test_redis_cache_roundtrip_and_ttl():
    r = FakeRedis()
    cache = RedisSearchCache(client=r, default_ttl_seconds=100, source_ttls={"Fast": 5})
    assert cache.get("esp32", 5) is None
    cache.set("ESP32 ", 5, [prod("Fast"), prod("Slow")])
    assert r.ttls["robo:esp32:5"] == 5
    got = cache.get("esp32", 5)
    assert [p.store for p in got] == ["Fast", "Slow"]
    assert json.loads(r.data["robo:esp32:5"])[0]["name"] == "ESP32"


def test_make_cache_picks_redis_from_env(monkeypatch, tmp_path):
    monkeypatch.delenv("ROBO_REDIS_URL", raising=False)
    assert isinstance(make_cache(db_path=str(tmp_path / "c.db")), SearchCache)
    fake = types.SimpleNamespace(Redis=types.SimpleNamespace(from_url=lambda url: FakeRedis()))
    monkeypatch.setitem(sys.modules, "redis", fake)
    monkeypatch.setenv("ROBO_REDIS_URL", "redis://localhost:1/0")
    assert isinstance(make_cache(), RedisSearchCache)


class Resp:
    def __init__(self, status, text=""):
        self.status_code, self.text = status, text

    def raise_for_status(self):
        pass


def test_http_rotates_fallback_headers_on_challenge(monkeypatch):
    seen = []

    def fake_request(**kw):
        seen.append(kw["headers"]["User-Agent"])
        return Resp(403, "cloudflare challenge") if len(seen) == 1 else Resp(200, "ok")

    monkeypatch.setattr(http_mod.requests, "request", fake_request)
    monkeypatch.setattr(http_mod.time, "sleep", lambda s: None)
    client = http_mod.HTTPClient(max_retries=2)
    assert client.get("http://x").status_code == 200
    assert seen[0] != seen[1]
