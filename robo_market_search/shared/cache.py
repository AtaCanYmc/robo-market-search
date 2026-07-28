"""
SQLite and memory-backed TTL caching layer for Robo Market Search.
"""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Any, List, Optional

from robo_market_search.shared.models import Product


class SearchCache:
    """
    SQLite tabanlı TTL önbellekleme katmanı.
    Arama sorgularının sonuçlarını belirletilen TTL (örneğin 1-2 saat) süresince saklar.
    """

    def __init__(self, db_path: Optional[str] = None, default_ttl_seconds: int = 7200) -> None:
        if db_path is None:
            # Varsayılan olarak kullanıcının cache dizininde sakla
            cache_dir = Path.home() / ".cache" / "robo_market_search"
            cache_dir.mkdir(parents=True, exist_ok=True)
            db_path = str(cache_dir / "search_cache.db")

        self.db_path = db_path
        self.default_ttl_seconds = default_ttl_seconds
        self._init_db()

    def _init_db(self) -> None:
        """Tabloları oluştur."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS search_cache (
                    cache_key TEXT PRIMARY KEY,
                    query TEXT NOT NULL,
                    results_json TEXT NOT NULL,
                    created_at REAL NOT NULL,
                    expires_at REAL NOT NULL
                )
                """
            )
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS idx_expires_at ON search_cache(expires_at)"
            )
            conn.commit()

    @staticmethod
    def _make_key(query: str, limit_per_store: int) -> str:
        clean_query = query.strip().lower()
        return f"{clean_query}:{limit_per_store}"

    def get(self, query: str, limit_per_store: int) -> Optional[List[Product]]:
        """
        Önbellekten sonuç getir. Süresi dolmuşsa None döner.
        """
        key = self._make_key(query, limit_per_store)
        now = time.time()

        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT results_json, expires_at FROM search_cache WHERE cache_key = ?",
                (key,),
            )
            row = cursor.fetchone()
            if not row:
                return None

            results_json, expires_at = row
            if now > expires_at:
                # Expired
                cursor.execute("DELETE FROM search_cache WHERE cache_key = ?", (key,))
                conn.commit()
                return None

            try:
                data = json.loads(results_json)
                return [
                    Product(
                        name=item["name"],
                        price=float(item["price"]),
                        currency=item.get("currency", "TL"),
                        url=item["url"],
                        store=item["store"],
                        image_url=item.get("image_url", ""),
                        in_stock=item.get("in_stock", True),
                    )
                    for item in data
                ]
            except Exception:
                return None

    def set(
        self,
        query: str,
        limit_per_store: int,
        products: List[Product],
        ttl_seconds: Optional[int] = None,
    ) -> None:
        """
        Sonuçları önbelleğe kaydet.
        """
        key = self._make_key(query, limit_per_store)
        ttl = ttl_seconds if ttl_seconds is not None else self.default_ttl_seconds
        now = time.time()
        expires_at = now + ttl

        serialized = [
            {
                "name": p.name,
                "price": p.price,
                "currency": p.currency,
                "url": p.url,
                "store": p.store,
                "image_url": p.image_url,
                "in_stock": p.in_stock,
            }
            for p in products
        ]
        results_json = json.dumps(serialized, ensure_ascii=False)

        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT OR REPLACE INTO search_cache (cache_key, query, results_json, created_at, expires_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (key, query.strip().lower(), results_json, now, expires_at),
            )
            conn.commit()

    def clear_expired(self) -> int:
        """Süresi dolmuş tüm önbellek kayıtlarını temizle."""
        now = time.time()
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM search_cache WHERE expires_at < ?", (now,))
            deleted = cursor.rowcount
            conn.commit()
            return deleted
