#!/usr/bin/env bash
# ==============================================================================
# robo-market-search One-Line Installer
# ==============================================================================
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/AtaCanYmc/robo-market-search/main/install.sh | bash
# ==============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${BLUE}${BOLD}====================================================${NC}"
echo -e "${BLUE}${BOLD}   Installing robo-market-search CLI & Ecosystem   ${NC}"
echo -e "${BLUE}${BOLD}====================================================${NC}"
echo ""

# Check for python3
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}[ERROR] python3 could not be found. Please install Python 3.8 or higher.${NC}"
    exit 1
fi

# Check for pipx
if ! command -v pipx &> /dev/null; then
    echo -e "${YELLOW}[!] pipx is not installed. Installing pipx...${NC}"
    python3 -m pip install --user pipx || {
        echo -e "${RED}[ERROR] Failed to install pipx. Please install pipx manually: https://pipx.pypa.io/${NC}"
        exit 1
    }
    python3 -m pipx ensurepath || true
fi

echo -e "${BLUE}[1/2] Installing robo-market-search via pipx...${NC}"

# If git repo exists locally or install directly from PyPI
if pipx install "robo-market-search[all]" --force; then
    echo -e "${GREEN}[✔] Successfully installed robo-market-search[all] from PyPI!${NC}"
else
    echo -e "${YELLOW}[!] PyPI install failed or not updated yet, trying direct GitHub installation...${NC}"
    pipx install "robo-market-search[all] @ git+https://github.com/AtaCanYmc/robo-market-search.git" --force
fi

echo ""
echo -e "${GREEN}${BOLD}====================================================${NC}"
echo -e "${GREEN}${BOLD}   Installation Complete! 🎉                        ${NC}"
echo -e "${GREEN}${BOLD}====================================================${NC}"
echo ""
echo -e "Try running:"
echo -e "  ${BOLD}robo-search --help${NC}   (Arama CLI aracı)"
echo -e "  ${BOLD}robo-mcp --help${NC}      (Model Context Protocol sunucusu)"
echo -e "  ${BOLD}robo-agent --help${NC}    (AI Donanım Ajanı)"
echo ""
