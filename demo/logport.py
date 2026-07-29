"""
Logport — Simple, lightweight search and analytics logger.
Sends search queries to background loggers/webhooks without blocking requests.
"""

from __future__ import annotations

import asyncio
import logging
import os
import urllib.parse
import urllib.request

logger = logging.getLogger("demo.logport")


_background_tasks = set()


class LogPort:
    """
    Kullanıcı arama sorgularını ve donanım tercihlerini loglayan ve isteğe bağlı
    Telegram bildirim kanallarına gönderen lightweight logger.
    """

    def __init__(self, service_name: str = "robo-market-search") -> None:
        self.service_name = service_name
        self.bot_token = os.getenv("LOGPORT_TELEGRAM_TOKEN") or os.getenv("TELEGRAM_BOT_TOKEN")
        self.chat_id = os.getenv("LOGPORT_TELEGRAM_CHAT_ID")

    def _send_telegram_sync(self, text: str) -> None:
        """Telegram Bot API ile senkron bildirim gönderir."""
        if not self.bot_token or not self.chat_id:
            return

        try:
            url = f"https://api.telegram.org/bot{self.bot_token}/sendMessage"
            payload = urllib.parse.urlencode({"chat_id": self.chat_id, "text": text, "parse_mode": "HTML"}).encode("utf-8")
            req = urllib.request.Request(url, data=payload, method="POST")
            with urllib.request.urlopen(req, timeout=3.0) as response:
                if response.status != 200:
                    logger.warning("Telegram log notification failed status=%s", response.status)
        except Exception as exc:
            logger.debug("Telegram log notification error: %s", exc)

    def log_search(self, query: str, total_results: int = 0, store_filter: list[str] | None = None) -> None:
        """
        Arama sorgusunu güvenli (IP veya kişisel veri tutmadan) loglar ve Telegram'a bildirir.
        """
        stores_str = ", ".join(store_filter) if store_filter else "Tüm Marketler"
        logger.info(
            "📊 [LOGPORT] Service=%s | SearchQuery=%r | ResultsCount=%d | FilteredStores=%s",
            self.service_name,
            query,
            total_results,
            stores_str,
        )

        if self.bot_token and self.chat_id:
            msg = (
                f"🔍 <b>Yeni Web Araması Yapıldı!</b>\n\n"
                f"<b>Sorgu:</b> <code>{query}</code>\n"
                f"<b>Sonuç Sayısı:</b> {total_results} ürün\n"
                f"<b>Filtreli Marketler:</b> {stores_str}\n"
                f"<b>Servis:</b> {self.service_name}"
            )
            try:
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    # Tamamen asenkron & non-blocking: cevabın dönmesini beklemez (fire-and-forget)
                    task = loop.create_task(asyncio.to_thread(self._send_telegram_sync, msg))
                    _background_tasks.add(task)
                    task.add_done_callback(_background_tasks.discard)
                else:
                    asyncio.run(asyncio.to_thread(self._send_telegram_sync, msg))
            except Exception as exc:
                logger.debug("Failed to dispatch async logport Telegram task: %s", exc)


# Global LogPort instance
logport = LogPort()
