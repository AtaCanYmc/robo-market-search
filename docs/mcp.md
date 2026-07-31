# Model Context Protocol (MCP) Guide

Robo Market Search features an official **MCP (Model Context Protocol)** server (`robo-mcp`) that enables AI assistants (Claude Desktop, Cursor, VS Code Cline/RooCode, Antigravity) to query live e-commerce store prices and optimize shopping carts autonomously.

---

## 🤖 What is Model Context Protocol?

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) is an open standard introduced by Anthropic that connects AI models to external tools, data sources, and APIs safely.

By connecting `robo-mcp`, your LLM assistant gains real-time access to Robotistan, Robolink, Robo90, and Direnç.net product inventories.

![MCP Claude Desktop Integration](../.github/screenshots/mcp_example.png)

---

## 🚀 Installation & Integration

Ensure `robo-market-search[mcp]` or `[all]` is installed:

```bash
pip install "robo-market-search[all]"
```

### 1. Claude Desktop Integration

Add the `robo-market-search` server configuration to your `claude_desktop_config.json`:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "robo-market-search": {
      "command": "robo-mcp",
      "args": []
    }
  }
}
```

---

### 2. Cursor / VS Code (Cline & RooCode) Integration

In Cursor or VS Code Cline settings, add an MCP Stdio Server:

- **Name**: `robo-market-search`
- **Command**: `robo-mcp`

---

## 🛠️ Tools Exposed by `robo-mcp`

### 1. `search_products`
Searches Robolink, Robotistan, Robo90, and Direnç.net for e-commerce products.

- **Inputs**:
  - `query` (`string`, required): Product keyword (e.g. `"ESP32"`).
  - `limit_per_store` (`integer`, optional): Results per store (default `5`).

### 2. `optimize_cart`
Evaluates a list of required components across stores to calculate the lowest total cost including shipping fees.

- **Inputs**:
  - `items` (`array` of `string`, required): List of component names.

---

## 💬 Example AI Prompts with MCP

Once `robo-mcp` is active in Claude Desktop or Cursor, you can ask:

> "Compare prices for an ESP32 WROOM development board across Turkish electronics stores and give me the direct links."

> "I need an Arduino Uno, a 5V relay module, and a 0.96 inch OLED display. Calculate the cheapest store cart split for these 3 items including shipping fees."
