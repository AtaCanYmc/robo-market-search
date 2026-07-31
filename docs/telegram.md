# Telegram Bot Integration Guide

Robo Market Search includes a built-in Telegram Bot runner (`robo-bot`) powered by **Aiogram 3**.

---

## 🤖 Features
- **Inline & Direct Product Search**: Instant product lookup across all 4 stores with store emojis, stock badges, and direct store links.
- **Interactive Cart Optimizer**: Send a list of parts to receive calculated store splits and shipping costs.
- **Rich Formatting**: Clean Telegram Markdown V2 formatting.

---

## 🚀 Setup & Launching

### 1. Create Bot Token via @BotFather
1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. Send `/newbot` and follow the instructions to get your HTTP API token (`123456789:ABCdef...`).

### 2. Install Extra Dependencies
```bash
pip install "robo-market-search[bot]"
```

### 3. Launch Bot Server
Set `BOT_TOKEN` in your environment and start `robo-bot`:

```bash
export BOT_TOKEN="123456789:ABCdef..."
robo-bot
```

---

## 💬 Available Bot Commands

| Command | Description | Example |
| :--- | :--- | :--- |
| `/start` | Welcome message and command guide | `/start` |
| `/help` | Detailed help menu | `/help` |
| `/search <query>` | Search products across stores | `/search ESP32-WROOM` |
| `/cart <items>` | Calculate split-cart optimization | `/cart ESP32, Relay 5V, OLED` |
