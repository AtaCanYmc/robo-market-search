# Troubleshooting Guide

Common issues, error messages, and step-by-step diagnostic solutions for **Robo Market Search**.

---

## ❓ Common Issues & Solutions

### 1. `Agent analysis failed: [Errno 2] No such file or directory: '.../prompts/system.txt'`

- **Cause**: Non-python `.txt` prompt template files were omitted during package build or Docker pip installation.
- **Solution**: Upgrade to `robo-market-search >= 1.4.0` which includes safe fallback prompt defaults in `robo_market_agent/prompts/__init__.py`. If using Docker, ensure `MANIFEST.in` is copied or build with `--force-reinstall`.

---

### 2. `ImportError: groq package is required to use GroqProvider. Install with pip install groq.`

- **Cause**: The specific LLM SDK package (`groq`, `openai`, `anthropic`, `google-generativeai`, `ollama`) is missing from the environment.
- **Solution**: Install full dependencies or specific LLM SDK:
  ```bash
  pip install "robo-market-search[all]"
  # or individually:
  pip install groq openai anthropic google-generativeai ollama
  ```

---

### 3. HTTP `403 Forbidden` / Cloudflare Blocking

- **Cause**: E-commerce stores (e.g. Robotistan, Robolink) detecting standard Python `urllib` or `requests` User-Agent.
- **Solution**: Robo Market Search uses `curl_cffi` with Chrome TLS fingerprinting (`impersonate="chrome"`). Ensure `curl_cffi >= 0.5.10` is installed.

---

### 4. Images Not Rendering in Web Demo / Mixed Content Error

- **Cause**: Store CDN URLs returning `http://` instead of `https://` or blocking hotlinking via HTTP `Referer` headers.
- **Solution**: The Vite React Web UI normalizes store image URLs to HTTPS and attaches `referrerPolicy="no-referrer"` to image tags.

---

### 5. Robolink Product Names Containing `||` Metadata

- **Cause**: Robolink search API embeds raw keyword tags inside product names (e.g. `ESP32 Board||esp32 kartı, esp32`).
- **Solution**: Cleaned in SDK and Frontend by splitting strings on `||` (`title.split('||')[0]`).

---

### 6. MCP Server Not Detected in Claude Desktop

- **Cause**: Incorrect command path or missing `robo-mcp` binary in `PATH`.
- **Solution**: Verify `robo-mcp` is callable in your terminal:
  ```bash
  which robo-mcp
  ```
  If using virtualenv, specify full absolute path in `claude_desktop_config.json`:
  ```json
  {
    "mcpServers": {
      "robo-market-search": {
        "command": "/Users/name/.venv/bin/robo-mcp",
        "args": []
      }
    }
  }
  ```
