#!/bin/bash

# ---------------------------------------------------------
# Robo Market Search - Telegram Bot Başlatma Örneği
# ---------------------------------------------------------

# 1. Telegram'da @BotFather üzerinden yeni bir bot oluşturun.
# 2. Size verilen HTTP API Token'ı kopyalayın.
# 3. Aşağıdaki "BOT_TOKENINIZ_BURAYA" yazan yeri kendi tokenınız ile değiştirin.

export TELEGRAM_BOT_TOKEN="<BOT_TOKENINIZ_BURAYA>"

echo "====================================================="
echo " 🤖 Robo Market Search - Telegram Bot Başlatılıyor..."
echo "====================================================="
echo ""
echo "Bot çalışmaya başladıktan sonra Telegram uygulamasına gidin,"
echo "botunuzla olan sohbete girin ve şu komutları deneyin:"
echo "  👉 /start"
echo "  👉 /ara Arduino Uno"
echo "  👉 /ara L298N Motor Sürücü"
echo ""
echo "Durdurmak için CTRL+C tuşlarına basabilirsiniz."
echo "-----------------------------------------------------"

# Eğer projeyi "pip install -e .[all]" ile kurduysanız, robo-bot komutu
# Sisteminizde otomatik olarak tanınacaktır:
# 1. Yöntem: Token'ı çevresel değişkenden okuyarak başlatma (Yukarıda export ettik)
robo-bot

# 2. Yöntem: Token'ı doğrudan argüman olarak vererek başlatma
# robo-bot --token "BOT_TOKENINIZ_BURAYA"

# Eğer komut bulunamadı hatası alırsanız:
# python -m robo_market_search.bot.server --token "BOT_TOKENINIZ_BURAYA"
