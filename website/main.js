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

  // 4. Fetch Latest GitHub Release Assets
  fetchLatestRelease();
});

/**
 * Detect client OS and activate corresponding download tab
 */
function detectAndSelectOS() {
  const ua = navigator.userAgent.toLowerCase();
  let os = "macos";

  if (ua.includes("win")) {
    os = "windows";
  } else if (ua.includes("linux")) {
    os = "linux";
  }

  // Activate matching tab button
  const matchingTabBtn = document.querySelector(`.tab-btn[data-target="${os}"]`);
  const matchingPane = document.getElementById(`tab-${os}`);

  if (matchingTabBtn && matchingPane) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

    matchingTabBtn.classList.add("active");
    matchingPane.classList.add("active");
  }

  // Update hero button with detected OS text
  const heroBtn = document.getElementById("hero-download-btn");
  if (heroBtn) {
    if (os === "windows") {
      heroBtn.textContent = "Windows için İndir (.msi / .exe)";
    } else if (os === "linux") {
      heroBtn.textContent = "Linux için İndir (.AppImage / .deb)";
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
 * Fetch latest release tags from GitHub API to enrich release labels
 */
async function fetchLatestRelease() {
  try {
    const res = await fetch("https://api.github.com/repos/AtaCanYmc/robo-market-search/releases/latest");
    if (!res.ok) return;
    const data = await res.json();
    if (data.tag_name) {
      const badges = document.querySelectorAll(".release-version-badge");
      badges.forEach(b => {
        b.textContent = data.tag_name;
      });
    }
  } catch (err) {
    // Graceful fallback to static v1.10.0
    console.debug("Offline or rate-limited GitHub API release check:", err);
  }
}
