#!/bin/bash
# Robo Market Search CLI Kullanım Örnekleri

# Tüm özellikleri kullanabilmek için projenin pip install ".[all]" ile kurulduğundan emin olun.

echo "--- 1. Basit Arama (ESP32-C3) ---"
robo-search "ESP32-C3"

echo "--- 2. Market Başına 3 Sonuç Limitli Arama (Arduino Uno) ---"
robo-search "Arduino Uno" --limit 3

echo "--- 3. Fiyat Sıralaması İptal Edilmiş Arama (PLA Filament) ---"
robo-search "PLA Filament" --no-sort
