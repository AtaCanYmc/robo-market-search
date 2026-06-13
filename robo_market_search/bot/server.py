import os
import asyncio
import logging
import sys
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
from aiogram.utils.formatting import Text, Bold

from robo_market_search.unified.client import UnifiedSearchClient

logging.basicConfig(level=logging.INFO, stream=sys.stdout)
logger = logging.getLogger(__name__)

# Initialize dispatcher
dp = Dispatcher()

@dp.message(Command("start"))
async def send_welcome(message: types.Message):
    """
    /start komutu için karşılama mesajı
    """
    welcome_text = (
        "🤖 *Robo Market Search Bot'a Hoş Geldiniz!*\n\n"
        "Bu bot, Türkiye'deki popüler elektronik ve robotik pazar yerlerinde "
        "(Robotistan, Dirençnet, Robo90, Robolink) eşzamanlı ve çok hızlı arama yapar.\n\n"
        "🔎 *Kullanım:*\n"
        "`/ara <ürün adı>` yazarak anında arama yapabilirsiniz.\n\n"
        "Örnek:\n"
        "`/ara ESP32`\n"
        "`/ara Arduino Uno R3`\n"
    )
    await message.answer(welcome_text, parse_mode=ParseMode.MARKDOWN)


@dp.message(Command("ara"))
async def search_components(message: types.Message):
    """
    /ara komutu ile ürün araması yapar.
    """
    # /ara komutundan sonraki argümanı al
    command_parts = message.text.split(maxsplit=1)
    if len(command_parts) < 2:
        await message.answer("⚠️ Lütfen aranacak ürünü belirtin. Örnek: `/ara ESP32`", parse_mode=ParseMode.MARKDOWN)
        return

    query = command_parts[1]
    
    # Kullanıcıya bekleme mesajı gönder
    wait_message = await message.answer(f"🔍 *'{query}'* için marketler taranıyor, lütfen bekleyin...", parse_mode=ParseMode.MARKDOWN)

    try:
        # Senkron arama işlemini event loop'u bloklamamak için thread içinde çalıştır
        client = UnifiedSearchClient()
        results = await asyncio.to_thread(
            lambda: client.search(query=query, limit_per_store=5)
        )

        if not results:
            await wait_message.edit_text(f"❌ *'{query}'* araması için hiçbir markette sonuç bulunamadı.", parse_mode=ParseMode.MARKDOWN)
            return

        # Markdown tablosu/listesi oluştur
        markdown_lines = [f"📊 *'{query}'* İçin En Ucuz Sonuçlar:\n"]
        
        # En ucuz 10 ürünü göster
        for idx, item in enumerate(results[:10], 1):
            stok = "✅ Stokta" if getattr(item, "in_stock", False) else "❌ Tükendi"
            fiyat = f"{item.price:.2f} {getattr(item, 'currency', 'TL')}" if getattr(item, "price", None) else "Fiyat Yok"
            market_adi = getattr(item, "store", "Bilinmeyen Market")
            urun_adi = getattr(item, "name", "İsimsiz Ürün")
            link = getattr(item, "url", "#")

            # Escape markdown special characters if necessary, but keep it simple
            urun_adi_safe = urun_adi.replace("[", "").replace("]", "").replace("*", "").replace("_", "")
            
            markdown_lines.append(
                f"{idx}\\. *{urun_adi_safe}*\n"
                f"🏪 Market: {market_adi}\n"
                f"💵 Fiyat: {fiyat}\n"
                f"📦 Durum: {stok}\n"
                f"🔗 [Ürüne Git]({link})\n"
            )

        final_text = "\n".join(markdown_lines)
        
        # Eğer çok uzunsa Telegram limitine takılmaması için kes (Genelde 4096 karakterdir)
        if len(final_text) > 4000:
            final_text = final_text[:4000] + "...\n(Mesaj çok uzun olduğu için kesildi)"

        await wait_message.edit_text(final_text, parse_mode=ParseMode.MARKDOWN, disable_web_page_preview=True)

    except Exception as e:
        logger.error(f"Arama hatası: {e}")
        await wait_message.edit_text("❌ Arama işlemi sırasında bir hata meydana geldi. Lütfen daha sonra tekrar deneyin.", parse_mode=ParseMode.MARKDOWN)


async def _run_bot():
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        logger.error("TELEGRAM_BOT_TOKEN ortam değişkeni bulunamadı. Lütfen token'ı ayarlayın.")
        sys.exit(1)

    # Bot objesini oluştur
    bot = Bot(token=token, default=DefaultBotProperties(parse_mode=ParseMode.MARKDOWN))
    
    logger.info("Bot başarıyla başlatıldı, mesajlar bekleniyor...")
    # Long polling ile mesaj dinlemeye başla
    await dp.start_polling(bot)


def main():
    """Entry point for robo-bot script"""
    try:
        asyncio.run(_run_bot())
    except KeyboardInterrupt:
        logger.info("Bot kullanıcı tarafından durduruldu.")

if __name__ == "__main__":
    main()
