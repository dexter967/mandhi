// ── PARTICLES ──
(function () {
  const wrap = document.getElementById("particles");
  for (let i = 0; i < 15; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const sz = Math.random() * 5 + 3;
    p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;animation-duration:${Math.random() * 12 + 6}s;animation-delay:${Math.random() * 8}s;opacity:0.7;box-shadow:0 0 8px var(--accent);`;
    wrap.appendChild(p);
  }
})();

// ── PARALLAX ──
const bg = document.getElementById("parallaxBg");
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.5)
      bg.style.transform = `translate3d(0,${y * 0.28}px,0) scale(1.02)`;
  },
  { passive: true },
);

// ── BRAND OVERLAY ──
function openBrandOverlay() {
  document.getElementById("brandOverlay").classList.add("open");
  document.getElementById("brandPanel").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeBrandOverlay() {
  document.getElementById("brandOverlay").classList.remove("open");
  document.getElementById("brandPanel").classList.remove("open");
  document.body.style.overflow = "";
}

// ── HERO LOCK / UNLOCK ──
document.body.style.overflow = "hidden";
function unlockAndScrollToMenu() {
  document.body.style.overflow = "";
  const t = document.getElementById("menu-anchor");
  if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target
          .querySelectorAll(".menu-card, .blog-card")
          .forEach((c, i) =>
            setTimeout(() => c.classList.add("revealed"), i * 70),
          );
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.05 },
);

function runGridObservations() {
  const g = document.querySelector(".cat-content.active .menu-grid");
  if (g) observer.observe(g);
  const b = document.querySelector(".blog-grid");
  if (b) observer.observe(b);
}

// ── TAB SWITCHING ──
function switchTabPanel(categoryKey, clickAnchor) {
  document
    .querySelectorAll(".cat-content")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".tab")
    .forEach((b) => b.classList.remove("active"));
  const target = document.getElementById(
    `cat-${categoryKey.replace(/\s+/g, "-")}`,
  );
  if (target) target.classList.add("active");
  if (clickAnchor) {
    clickAnchor.classList.add("active");
  } else {
    document.querySelectorAll(".tab").forEach((btn) => {
      if (
        btn.getAttribute("onclick") &&
        btn.getAttribute("onclick").includes(`'${categoryKey}'`)
      )
        btn.classList.add("active");
    });
  }
  setTimeout(() => runGridObservations(), 40);
}

// ── FEEDBACK FORM — fetch submit + clear ──
document
  .getElementById("feedbackForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const btn = document.getElementById("feedbackSubmitBtn");
    btn.textContent = "Sending...";
    btn.disabled = true;

    const formData = new FormData(this);
    formData.append("access_key", "dcad1e03-4736-4553-87dd-3d527362cc1e");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        document.getElementById("fName").value = "";
        document.getElementById("fEmail").value = "";
        document.getElementById("fReview").value = "";
        document.getElementById("feedbackSuccess").style.display = "block";
        document.getElementById("feedbackForm").style.display = "none";
        setTimeout(() => {
          document.getElementById("feedbackSuccess").style.display = "none";
          document.getElementById("feedbackForm").style.display = "flex";
          btn.textContent = "Submit Feedback";
          btn.disabled = false;
        }, 5000);
      } else {
        btn.textContent = "Submit Feedback";
        btn.disabled = false;
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      btn.textContent = "Submit Feedback";
      btn.disabled = false;
      alert("Connection error. Please try again.");
    }
  });

// ── MODAL DATA ──
const ALL = {
  "Yemeni Mandhi Dishes": [
    {
      n: "Chicken Yemeni Mandhi",
      p: { Quarter: "₹210", Half: "₹400", Full: "₹750" },
    },
    {
      n: "Chicken Spicy Mandhi",
      p: { Quarter: "₹260", Half: "₹480", Full: "₹850" },
    },
    {
      n: "Beef Ran Mandhi",
      p: { Quarter: "₹300", Half: "₹520", Full: "₹970" },
    },
    {
      n: "Mutton Yemeni Mandhi",
      p: { Quarter: "₹430", Half: "₹870", Full: "₹1750" },
    },
    { n: "Veg Mandhi", p: { Quarter: "₹120", Half: "₹220", Full: "₹380" } },
    {
      n: "Mandhi Rice Only",
      p: { Quarter: "₹140", Half: "₹240", Full: "₹400" },
    },
    { n: "Chicken Madhooth (Prebook 1 Hr)", p: { Full: "₹1010" } },
  ],
  "Grilled Mandhi": [
    { n: "Alfaham Mandhi", p: { Quarter: "₹250", Half: "₹440", Full: "₹840" } },
    { n: "Shezwan Mandhi", p: { Quarter: "₹270", Half: "₹490", Full: "₹850" } },
    {
      n: "Cheese Alfaham Mandhi",
      p: { Quarter: "₹310", Half: "₹540", Full: "₹960" },
    },
    {
      n: "BBQ Alfaham Mandhi",
      p: { Quarter: "₹260", Half: "₹490", Full: "₹870" },
    },
    {
      n: "Honey Chilli Mandhi",
      p: { Quarter: "₹270", Half: "₹510", Full: "₹870" },
    },
    {
      n: "Kanthari Mandhi",
      p: { Quarter: "₹250", Half: "₹480", Full: "₹870" },
    },
    {
      n: "Peri Peri Mandhi",
      p: { Quarter: "₹270", Half: "₹510", Full: "₹870" },
    },
    { n: "Pepper Mandhi", p: { Quarter: "₹250", Half: "₹480", Full: "₹870" } },
    {
      n: "Arabic Shawaya Mandhi",
      p: { Quarter: "₹270", Half: "₹500", Full: "₹850" },
    },
    {
      n: "Masala Shawaya Mandhi",
      p: { Quarter: "₹300", Half: "₹530", Full: "₹900" },
    },
  ],
  "Charcoal Grilled Pieces": [
    {
      n: "Alfaham Chicken",
      p: { Quarter: "₹180", Half: "₹310", Full: "₹590" },
    },
    {
      n: "Shezwan Alfaham",
      p: { Quarter: "₹210", Half: "₹360", Full: "₹630" },
    },
    { n: "Cheese Alfaham", p: { Quarter: "₹220", Half: "₹390", Full: "₹650" } },
    { n: "BBQ Chicken", p: { Quarter: "₹200", Half: "₹350", Full: "₹620" } },
    {
      n: "Peri Peri Alfaham",
      p: { Quarter: "₹200", Half: "₹350", Full: "₹630" },
    },
    {
      n: "Honey Chilli Chicken",
      p: { Quarter: "₹210", Half: "₹360", Full: "₹630" },
    },
    {
      n: "Kanthari Chicken",
      p: { Quarter: "₹200", Half: "₹350", Full: "₹620" },
    },
    { n: "Pepper Alfaham", p: { Quarter: "₹200", Half: "₹350", Full: "₹610" } },
    { n: "Arabic Shawaya", p: { Quarter: "₹170", Half: "₹320", Full: "₹600" } },
    { n: "Masala Shawaya", p: { Quarter: "₹210", Half: "₹350", Full: "₹630" } },
  ],
  "Mandhi Meat Side Pieces (No Rice)": [
    {
      n: "Chicken Mandhi Pieces",
      p: { Quarter: "₹150", Half: "₹290", Full: "₹550" },
    },
    {
      n: "Beef Mandhi Pieces",
      p: { Quarter: "₹130", Half: "₹260", Full: "₹500" },
    },
    { n: "Mutton Mandhi Pieces", p: { Half: "₹650", Full: "₹1350" } },
    { n: "Extra Mayonnaise", p: { "Per Serving": "₹20" } },
  ],
  "Fresh Juices": [
    { n: "Mint Lime Juice", p: { "Per Glass": "₹50" } },
    { n: "Fresh Lime Juice", p: { "Per Glass": "₹40" } },
    { n: "Pressed Watermelon Juice", p: { "Per Glass": "₹60" } },
    { n: "Ginger Lime Infusion", p: { "Per Glass": "₹60" } },
    { n: "Crushed Pineapple Juice", p: { "Per Glass": "₹60" } },
  ],
};

function openModal() {
  let h = "";
  for (const [cat, items] of Object.entries(ALL)) {
    h += `<div class="modal-cat"><div class="modal-cat-title">${cat}</div>`;
    items.forEach((it) => {
      const b = Object.entries(it.p)
        .map(([k, v]) => `<span class="modal-badge">${k}: ${v}</span>`)
        .join("");
      h += `<div class="modal-item"><div class="modal-item-name">${it.n}</div><div class="modal-badges">${b}</div></div>`;
    });
    h += "</div>";
  }
  document.getElementById("modalBody").innerHTML = h;
  document.getElementById("overlay").classList.add("open");
  document.getElementById("modalPanel").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  document.getElementById("overlay").classList.remove("open");
  document.getElementById("modalPanel").classList.remove("open");
  document.body.style.overflow = "";
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    closeBrandOverlay();
  }
});

// ── AUTO-CYCLING HOVER ENGINE ──
(function () {
  let queue = [];
  let idx = 0;

  function buildQueue() {
    const groups = [
      [...document.querySelectorAll("nav a")],
      [...document.querySelectorAll(".tab")],
      [...document.querySelectorAll(".menu-card.revealed")],
      [...document.querySelectorAll(".menu-card.revealed")],
      [...document.querySelectorAll(".blog-card.revealed")],
      [...document.querySelectorAll(".nav-map-link")],
      [...document.querySelectorAll(".menu-dot-btn")],
    ];
    queue = [];
    groups.forEach((g) => g.forEach((el) => queue.push(el)));
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
  }

  function highlightNext() {
    if (idx === 0) buildQueue();
    if (!queue.length) {
      idx = 0;
      return;
    }
    const el = queue[idx % queue.length];
    idx++;
    if (!el || !document.body.contains(el)) return;
    if (el.classList.contains("tab") && el.classList.contains("active")) return;
    el.classList.add("auto-lit");
    setTimeout(() => el.classList.remove("auto-lit"), 900);
  }

  setTimeout(() => {
    setInterval(highlightNext, 1800);
  }, 2000);
})();

// ── LIVE MENU FROM BACKEND API (Node.js + Express + Supabase) ──
const API_BASE_URL = "http://localhost:5000/api";
const MENU_ENDPOINT = `${API_BASE_URL}/menu`;
const DEFAULT_FALLBACK_IMAGE =
  "https://i.postimg.cc/tTf92z4s/Gemini-Generated-Image-3m9wp93m9wp93m9w.png";

// Category presentation metadata — keyed by category name (or "UNCATEGORIZED").
// Falls back to an auto-generated style for any category not listed here.
const CATEGORY_STYLES = {
  "YEMENI MANDHI": {
    label: "✦ Heritage Collection",
    title: "Yemeni Mandhi Dishes",
    tab: "Yemeni Mandhi",
  },
  "GRILLED MANDHI": {
    label: "✦ Grilled Fusion",
    title: "Grilled Mandhi",
    tab: "Grilled Mandhi",
  },
  "GRILLED PIECES": {
    label: "✦ Pit-Charred Elements",
    title: "Grilled Charred Pieces",
    tab: "Grilled Pieces",
  },
  "MANDHI PIECES": {
    label: "✦ Pure Proteins",
    title: "Mandhi Meat Side Pieces",
    tab: "Mandhi Pieces",
  },
  "FRESH JUICES": {
    label: "✦ Fresh Juices",
    title: "Fresh Juices",
    tab: "Fresh Juices",
  },
  UNCATEGORIZED: { label: "✦ Our Menu", title: "Menu", tab: "Menu" },
};

// Quick helper to generate professional styling titles for categories not explicitly listed above
function getCategoryStyle(catKey) {
  if (CATEGORY_STYLES[catKey]) return CATEGORY_STYLES[catKey];

  const cleanTitle = String(catKey)
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    label: `✦ Modern Additions`,
    title: `${cleanTitle} Selection`,
    tab: cleanTitle,
  };
}

let parsedMenuData = {};
let dynamicCategoryOrder = [];

// Formats a numeric price into a display string, e.g. 299 -> "₹299"
function formatPrice(price) {
  if (price === null || price === undefined || price === "") return "";
  const num = Number(price);
  if (Number.isNaN(num)) return String(price);
  return `₹${num}`;
}

// Escapes text before it is dropped into innerHTML, so item names/descriptions
// coming from the database can never break markup or inject scripts.
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Builds the price badge markup for one menu card, showing whichever of
// qtr/half/full are actually populated for that item.
function buildPriceBadges(item) {
  const rows = [];
  if (item.qtr)
    rows.push(
      `<span class="menu-card-badge">Qtr: ${escapeHtml(item.qtr)}</span>`,
    );
  if (item.half)
    rows.push(
      `<span class="menu-card-badge">Half: ${escapeHtml(item.half)}</span>`,
    );
  if (item.full)
    rows.push(
      `<span class="menu-card-badge">${item.qtr || item.half ? "Full: " : ""}${escapeHtml(item.full)}</span>`,
    );
  return rows.join("");
}

// Builds the full tabs + category-panel markup and injects it into #menuWrap,
// then wires up scroll-reveal observation on the now-active grid.
function renderDynamicWebLayout() {
  const wrap = document.getElementById("menuWrap");
  if (!wrap) return;

  if (!dynamicCategoryOrder.length) {
    wrap.innerHTML = `<div style="text-align:center;padding:60px;color:var(--text-muted);font-family:var(--font-thematic);font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">✦ No menu items available right now. ✦</div>`;
    return;
  }

  let tabsHtml = '<div class="menu-tabs">';
  let panelsHtml = "";

  dynamicCategoryOrder.forEach((catKey, i) => {
    const style = getCategoryStyle(catKey);
    const isActive = i === 0;
    const panelId = `cat-${catKey.replace(/\s+/g, "-")}`;

    tabsHtml += `<button type="button" class="tab${isActive ? " active" : ""}" onclick="switchTabPanel('${catKey.replace(/'/g, "\\'")}', this)">${escapeHtml(style.tab)}</button>`;

    let cardsHtml = "";
    (parsedMenuData[catKey] || []).forEach((item) => {
      cardsHtml += `
        <div class="menu-card">
          <div class="menu-card-img">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.src='${DEFAULT_FALLBACK_IMAGE}'">
          </div>
          <div class="menu-card-body">
            <h3 class="menu-card-name">${escapeHtml(item.name)}</h3>
            ${item.description ? `<p class="menu-card-desc">${escapeHtml(item.description)}</p>` : ""}
            ${item.tag ? `<div class="menu-card-tag">${escapeHtml(item.tag)}</div>` : ""}
            <div class="menu-card-prices">${buildPriceBadges(item)}</div>
          </div>
        </div>`;
    });

    panelsHtml += `
      <div class="cat-content${isActive ? " active" : ""}" id="${panelId}">
        <div class="cat-content-label">${escapeHtml(style.label)}</div>
        <h2 class="cat-content-title">${escapeHtml(style.title)}</h2>
        <div class="menu-grid">${cardsHtml}</div>
      </div>`;
  });

  tabsHtml += "</div>";

  wrap.innerHTML = tabsHtml + panelsHtml;

  setTimeout(() => runGridObservations(), 40);
}

// Groups the raw API items into parsedMenuData / dynamicCategoryOrder and
// triggers the render pipeline. Takes already-fetched data — no network call
// happens in here, so this can be reused without ever double-fetching.
function processAndRenderMenu(items) {
  parsedMenuData = {};
  dynamicCategoryOrder = [];

  const sorted = items
    .filter((item) => item.is_available !== false)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  sorted.forEach((item) => {
    // Prefer a human-readable category_name from the backend; fall back to
    // category_id (e.g. before categories are named) and finally UNCATEGORIZED.
    const rawCat = item.category_name || item.category_id || "UNCATEGORIZED";
    const cat = String(rawCat).toUpperCase().trim();

    if (!parsedMenuData[cat]) {
      parsedMenuData[cat] = [];
      dynamicCategoryOrder.push(cat);
    }

    const tags = [];
    if (item.is_bestseller) tags.push("Bestseller");
    if (item.is_featured) tags.push("Featured");

    parsedMenuData[cat].push({
      name: item.name || "",
      description: item.description || "",
      qtr: "",
      half: "",
      full: formatPrice(item.price),
      tag: tags.join(" · "),
      image:
        item.image_url && item.image_url.trim()
          ? item.image_url.trim()
          : DEFAULT_FALLBACK_IMAGE,
    });
  });

  renderDynamicWebLayout();
}

// Single entry point: fetches the menu exactly once, then hands the raw
// items to processAndRenderMenu for grouping/rendering.
let menuData = [];
async function loadMenu() {
  try {
    const response = await fetch("http://localhost:5000/api/menu");
    const result = await response.json();
    const items = result.data;

    if (!result || !result.success || !Array.isArray(items)) {
      throw new Error("Unexpected response shape from menu API");
    }

    menuData = items;
    processAndRenderMenu(menuData);
  } catch (err) {
    console.error("Menu load error:", err);
    document.getElementById("menuWrap").innerHTML =
      `<div style="text-align:center;padding:60px;color:var(--text-muted);font-family:var(--font-thematic);font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">✦ Could not connect to menu. Please refresh. ✦</div>`;
  }
}

document.addEventListener("DOMContentLoaded", loadMenu);
