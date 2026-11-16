/**
 * Robo Market Search - Official Website Interactive Controller
 * Lightweight Vanilla JS (Ponytail & Antislop compliant)
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. OS Detection & Auto-Selection
  detectAndSelectOS();

  // 2. Tab Switchers (Downloads & Code Snippets)
  setupTabs();

  // 3. One-Click Copy for Terminal Commands
  setupCopyButtons();

  // 4. Fetch Latest GitHub Release Assets & Wire Download Buttons
  fetchLatestRelease();
});

let detectedPlatform = "macos";
let releaseAssetsFound = false;

/**
 * Detect client OS and activate corresponding download tab
 */
function detectAndSelectOS() {
  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes("win")) {
    detectedPlatform = "windows";
  } else if (ua.includes("linux")) {
    detectedPlatform = "linux";
  } else {
    detectedPlatform = "macos";
  }

  // Activate matching tab button
  const matchingTabBtn = document.querySelector(`.tab-btn[data-target="${detectedPlatform}"]`);
  const matchingPane = document.getElementById(`tab-${detectedPlatform}`);

  if (matchingTabBtn && matchingPane) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

    matchingTabBtn.classList.add("active");
    matchingPane.classList.add("active");
  }

  // Update hero button with detected OS text & attribute
  const heroBtn = document.getElementById("hero-download-btn");
  if (heroBtn) {
    heroBtn.setAttribute("data-detected-os", detectedPlatform);
    if (detectedPlatform === "windows") {
      heroBtn.textContent = "Windows için İndir (.msi)";
    } else if (detectedPlatform === "linux") {
      heroBtn.textContent = "Linux için İndir (.AppImage)";
    } else {
      heroBtn.textContent = "macOS için İndir (.dmg)";
    }
  }
}

/**
 * Setup Download Tab Switching
 */
function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      if (!target) return;

      tabButtons.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPane = document.getElementById(`tab-${target}`);
      if (targetPane) {
        targetPane.classList.add("active");
      }
    });
  });
}

/**
 * Setup Click-to-Copy for Code Boxes
 */
function setupCopyButtons() {
  const copyButtons = document.querySelectorAll(".code-copy-btn");
  copyButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const codeText = btn.getAttribute("data-copy") || btn.parentElement.querySelector("code")?.textContent;
      if (!codeText) return;

      try {
        await navigator.clipboard.writeText(codeText.trim());
        const originalText = btn.textContent;
        btn.textContent = "Kopyalandı!";
        btn.style.borderColor = "var(--color-accent)";
        btn.style.color = "var(--color-accent)";

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.borderColor = "";
          btn.style.color = "";
        }, 2000);
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    });
  });
}

/**
 * Helper to update button href and mark as ready
 */
function bindDirectUrl(buttonId, url) {
  if (!url) return;
  const btn = document.getElementById(buttonId);
  if (btn) {
    btn.href = url;
    btn.setAttribute("download", "");
    btn.setAttribute("data-ready", "true");
  }
}

/**
 * Fetch latest release tags and binary assets from GitHub API
 */
async function fetchLatestRelease() {
  try {
    const res = await fetch("https://api.github.com/repos/AtaCanYmc/robo-market-search/releases");
    if (!res.ok) return;
    const releases = await res.json();
    if (!Array.isArray(releases) || releases.length === 0) return;

    const latestRelease = releases[0];
    const tagName = latestRelease.tag_name || "v1.11.1";

    // 1. Update version badges
    const badges = document.querySelectorAll(".release-version-badge");
    badges.forEach(b => {
      b.textContent = tagName;
    });

    // Find the newest release that has compiled binary assets uploaded
    const releaseWithAssets = releases.find(r => Array.isArray(r.assets) && r.assets.length > 0) || latestRelease;
    const assets = releaseWithAssets.assets || [];
    const directLinks = {};

    if (assets.length > 0) {
      releaseAssetsFound = true;
      assets.forEach(asset => {
        const name = asset.name.toLowerCase();
        const url = asset.browser_download_url;

        if (name.endsWith(".dmg")) {
          if (name.includes("aarch64") || name.includes("arm64")) {
            directLinks["macos-arm64"] = url;
          } else if (name.includes("x64") || name.includes("x86") || name.includes("intel")) {
            directLinks["macos-intel"] = url;
          } else {
            directLinks["macos-general"] = url;
          }
        } else if (name.endsWith(".msi")) {
          directLinks["windows-msi"] = url;
        } else if (name.endsWith(".exe")) {
          directLinks["windows-exe"] = url;
        } else if (name.endsWith(".appimage")) {
          directLinks["linux-appimage"] = url;
        } else if (name.endsWith(".deb")) {
          directLinks["linux-deb"] = url;
        }
      });

      // Bind direct download links
      bindDirectUrl("btn-macos-arm64", directLinks["macos-arm64"] || directLinks["macos-general"]);
      bindDirectUrl("btn-macos-intel", directLinks["macos-intel"] || directLinks["macos-general"]);
      bindDirectUrl("btn-windows-msi", directLinks["windows-msi"]);
      bindDirectUrl("btn-windows-exe", directLinks["windows-exe"]);
      bindDirectUrl("btn-linux-appimage", directLinks["linux-appimage"]);
      bindDirectUrl("btn-linux-deb", directLinks["linux-deb"]);

      // Update hero CTA button
      const heroBtn = document.getElementById("hero-download-btn");
      if (heroBtn) {
        if (detectedPlatform === "windows" && directLinks["windows-msi"]) {
          heroBtn.href = directLinks["windows-msi"];
        } else if (detectedPlatform === "linux" && directLinks["linux-appimage"]) {
          heroBtn.href = directLinks["linux-appimage"];
        } else if (directLinks["macos-arm64"] || directLinks["macos-general"]) {
          heroBtn.href = directLinks["macos-arm64"] || directLinks["macos-general"];
        }
        heroBtn.setAttribute("download", "");
      }
    } else {
      // No assets uploaded yet for this release tag
      setupPendingNotification(tagName);
    }
  } catch (err) {
    console.debug("GitHub API release check offline:", err);
  }
}

/**
 * Handle clicks when binary assets are still compiling or waiting on GitHub Actions
 */
function setupPendingNotification(tagName) {
  const downloadBtns = document.querySelectorAll(".btn-download, #hero-download-btn");
  downloadBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const isReady = btn.getAttribute("data-ready") === "true";
      if (!isReady) {
        e.preventDefault();
        showPendingModal(tagName);
      }
    });
  });
}

function showPendingModal(tagName) {
  // Prevent duplicate modals
  if (document.getElementById("pending-download-modal")) return;

  const modal = document.createElement("div");
  modal.id = "pending-download-modal";
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(3, 6, 14, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;

  modal.innerHTML = `
    <div style="
      background: var(--color-surface, #0F172A);
      border: 1px solid var(--color-accent, #00F0FF);
      border-radius: 16px;
      max-width: 520px;
      width: 100%;
      padding: 32px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(0,240,255,0.15);
      position: relative;
    ">
      <button id="close-modal-btn" style="
        position: absolute;
        top: 16px;
        right: 16px;
        color: var(--color-text-muted, #94A3B8);
        font-size: 20px;
        cursor: pointer;
        padding: 4px 8px;
        line-height: 1;
      ">✕</button>

      <div style="font-size: 2rem; margin-bottom: 12px;">⚙️</div>
      <h3 style="font-size: 1.3rem; margin-bottom: 8px; color: var(--color-text-main, #FFF);">
        Masaüstü Paketleri Derleniyor (${tagName})
      </h3>
      <p style="color: var(--color-text-muted, #94A3B8); font-size: 0.95rem; margin-bottom: 20px; line-height: 1.5;">
        Yeni sürümün <strong>.dmg</strong>, <strong>.msi</strong> ve <strong>.AppImage</strong> ikili paketleri GitHub Actions üzerinde derleniyor. Derleme tamamlandığında doğrudan buradan indirilecektir.
      </p>

      <div style="
        background: #03060E;
        border: 1px solid var(--color-border, #1E293B);
        border-radius: 8px;
        padding: 12px 14px;
        margin-bottom: 20px;
      ">
        <div style="font-size: 0.8rem; color: var(--color-accent, #00F0FF); margin-bottom: 6px; font-weight: 600;">
          Şimdi Terminalden Hemen Kurun (Homebrew):
        </div>
        <div style="font-family: var(--font-mono, monospace); font-size: 0.85rem; color: #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
          <span>brew install atacanymc/tap/robo-market-search</span>
        </div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <a href="https://github.com/AtaCanYmc/robo-market-search/actions/workflows/desktop-release.yml" target="_blank" style="
          padding: 10px 18px;
          border-radius: 8px;
          background: var(--color-surface-hover, #1E293B);
          color: var(--color-text-main, #FFF);
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
        ">GitHub Actions Durumu ↗</a>
        <a href="https://github.com/AtaCanYmc/robo-market-search/releases/latest" target="_blank" style="
          padding: 10px 18px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--color-accent, #00F0FF) 0%, var(--color-primary, #3B82F6) 100%);
          color: #030712;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
        ">Releases Sayfası ↗</a>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector("#close-modal-btn").addEventListener("click", () => {
    modal.remove();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });
}
