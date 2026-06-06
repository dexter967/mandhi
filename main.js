// ── PARTICLES ──
(function () {
  const wrap = document.getElementById('particles');
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const sz = Math.random() * 5 + 3;
    p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;animation-duration:${Math.random() * 12 + 6}s;animation-delay:${Math.random() * 8}s;opacity:0.7;box-shadow:0 0 8px var(--accent);`;
    wrap.appendChild(p);
  }
})();

// ── PARALLAX ──
const bg = document.getElementById('parallaxBg');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight * 1.5)
    bg.style.transform = `translate3d(0,${y * 0.28}px,0) scale(1.02)`;
}, { passive: true });

// ── BRAND OVERLAY ──
function openBrandOverlay() {
  document.getElementById('brandOverlay').classList.add('open');
  document.getElementById('brandPanel').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeBrandOverlay() {
  document.getElementById('brandOverlay').classList.remove('open');
  document.getElementById('brandPanel').classList.remove('open');
  document.body.style.overflow = '';
}

// ── HERO LOCK / UNLOCK ──
document.body.style.overflow = 'hidden';
function unlockAndScrollToMenu() {
  document.body.style.overflow = '';
  const t = document.getElementById('menu-anchor');
  if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.menu-card, .blog-card').forEach((c, i) =>
        setTimeout(() => c.classList.add('revealed'), i * 70)
      );
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.05 });

function runGridObservations() {
  const g = document.querySelector('.cat-content.active .menu-grid');
  if (g) observer.observe(g);
  const b = document.querySelector('.blog-grid');
  if (b) observer.observe(b);
}

// ── TAB SWITCHING ──
function switchTabPanel(categoryKey, clickAnchor) {
  document.querySelectorAll('.cat-content').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  const target = document.getElementById(`cat-${categoryKey.replace(/\s+/g, '-')}`);
  if (target) target.classList.add('active');
  if (clickAnchor) {
    clickAnchor.classList.add('active');
  } else {
    document.querySelectorAll('.tab').forEach(btn => {
      if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${categoryKey}'`))
        btn.classList.add('active');
    });
  }
  setTimeout(() => runGridObservations(), 40);
}

// ── FEEDBACK FORM — fetch submit + clear ──
document.getElementById('feedbackForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = document.getElementById('feedbackSubmitBtn');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  const formData = new FormData(this);
  formData.append('access_key', 'dcad1e03-4736-4553-87dd-3d527362cc1e');

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById('fName').value = '';
      document.getElementById('fEmail').value = '';
      document.getElementById('fReview').value = '';
      document.getElementById('feedbackSuccess').style.display = 'block';
      document.getElementById('feedbackForm').style.display = 'none';
      setTimeout(() => {
        document.getElementById('feedbackSuccess').style.display = 'none';
        document.getElementById('feedbackForm').style.display = 'flex';
        btn.textContent = 'Submit Feedback';
        btn.disabled = false;
      }, 5000);
    } else {
      btn.textContent = 'Submit Feedback';
      btn.disabled = false;
      alert('Something went wrong. Please try again.');
    }
  } catch (err) {
    btn.textContent = 'Submit Feedback';
    btn.disabled = false;
    alert('Connection error. Please try again.');
  }
});

// ── MODAL DATA ──
const ALL = {
  'Yemeni Mandhi Dishes': [
    { n: 'Chicken Yemeni Mandhi',         p: { Quarter: '₹210', Half: '₹400',  Full: '₹750'  } },
    { n: 'Chicken Spicy Mandhi',           p: { Quarter: '₹260', Half: '₹480',  Full: '₹850'  } },
    { n: 'Beef Ran Mandhi',                p: { Quarter: '₹300', Half: '₹520',  Full: '₹970'  } },
    { n: 'Mutton Yemeni Mandhi',           p: { Quarter: '₹430', Half: '₹870',  Full: '₹1750' } },
    { n: 'Veg Mandhi',                     p: { Quarter: '₹120', Half: '₹220',  Full: '₹380'  } },
    { n: 'Mandhi Rice Only',               p: { Quarter: '₹140', Half: '₹240',  Full: '₹400'  } },
    { n: 'Chicken Madhooth (Prebook 1 Hr)',p: { Full: '₹1010' } }
  ],
  'Grilled Mandhi': [
    { n: 'Alfaham Mandhi',         p: { Quarter: '₹250', Half: '₹440', Full: '₹840' } },
    { n: 'Shezwan Mandhi',         p: { Quarter: '₹270', Half: '₹490', Full: '₹850' } },
    { n: 'Cheese Alfaham Mandhi',  p: { Quarter: '₹310', Half: '₹540', Full: '₹960' } },
    { n: 'BBQ Alfaham Mandhi',     p: { Quarter: '₹260', Half: '₹490', Full: '₹870' } },
    { n: 'Honey Chilli Mandhi',    p: { Quarter: '₹270', Half: '₹510', Full: '₹870' } },
    { n: 'Kanthari Mandhi',        p: { Quarter: '₹250', Half: '₹480', Full: '₹870' } },
    { n: 'Peri Peri Mandhi',       p: { Quarter: '₹270', Half: '₹510', Full: '₹870' } },
    { n: 'Pepper Mandhi',          p: { Quarter: '₹250', Half: '₹480', Full: '₹870' } },
    { n: 'Arabic Shawaya Mandhi',  p: { Quarter: '₹270', Half: '₹500', Full: '₹850' } },
    { n: 'Masala Shawaya Mandhi',  p: { Quarter: '₹300', Half: '₹530', Full: '₹900' } }
  ],
  'Charcoal Grilled Pieces': [
    { n: 'Alfaham Chicken',      p: { Quarter: '₹180', Half: '₹310', Full: '₹590' } },
    { n: 'Shezwan Alfaham',      p: { Quarter: '₹210', Half: '₹360', Full: '₹630' } },
    { n: 'Cheese Alfaham',       p: { Quarter: '₹220', Half: '₹390', Full: '₹650' } },
    { n: 'BBQ Chicken',          p: { Quarter: '₹200', Half: '₹350', Full: '₹620' } },
    { n: 'Peri Peri Alfaham',    p: { Quarter: '₹200', Half: '₹350', Full: '₹630' } },
    { n: 'Honey Chilli Chicken', p: { Quarter: '₹210', Half: '₹360', Full: '₹630' } },
    { n: 'Kanthari Chicken',     p: { Quarter: '₹200', Half: '₹350', Full: '₹620' } },
    { n: 'Pepper Alfaham',       p: { Quarter: '₹200', Half: '₹350', Full: '₹610' } },
    { n: 'Arabic Shawaya',       p: { Quarter: '₹170', Half: '₹320', Full: '₹600' } },
    { n: 'Masala Shawaya',       p: { Quarter: '₹210', Half: '₹350', Full: '₹630' } }
  ],
  'Mandhi Meat Side Pieces (No Rice)': [
    { n: 'Chicken Mandhi Pieces', p: { Quarter: '₹150', Half: '₹290', Full: '₹550'  } },
    { n: 'Beef Mandhi Pieces',    p: { Quarter: '₹130', Half: '₹260', Full: '₹500'  } },
    { n: 'Mutton Mandhi Pieces',  p: { Half: '₹650',  Full: '₹1350' } },
    { n: 'Extra Mayonnaise',      p: { 'Per Serving': '₹20' } }
  ],
  'Fresh Juices': [
    { n: 'Mint Lime Juice',            p: { 'Per Glass': '₹50' } },
    { n: 'Fresh Lime Juice',           p: { 'Per Glass': '₹40' } },
    { n: 'Pressed Watermelon Juice',   p: { 'Per Glass': '₹60' } },
    { n: 'Ginger Lime Infusion',       p: { 'Per Glass': '₹60' } },
    { n: 'Crushed Pineapple Juice',    p: { 'Per Glass': '₹60' } }
  ]
};

function openModal() {
  let h = '';
  for (const [cat, items] of Object.entries(ALL)) {
    h += `<div class="modal-cat"><div class="modal-cat-title">${cat}</div>`;
    items.forEach(it => {
      const b = Object.entries(it.p).map(([k, v]) => `<span class="modal-badge">${k}: ${v}</span>`).join('');
      h += `<div class="modal-item"><div class="modal-item-name">${it.n}</div><div class="modal-badges">${b}</div></div>`;
    });
    h += '</div>';
  }
  document.getElementById('modalBody').innerHTML = h;
  document.getElementById('overlay').classList.add('open');
  document.getElementById('modalPanel').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('modalPanel').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeBrandOverlay(); }
});

// ── AUTO-CYCLING HOVER ENGINE ──
(function () {
  let queue = [];
  let idx = 0;

  function buildQueue() {
    const groups = [
      [...document.querySelectorAll('nav a')],
      [...document.querySelectorAll('.tab')],
      [...document.querySelectorAll('.menu-card.revealed')],
      [...document.querySelectorAll('.menu-card.revealed')],
      [...document.querySelectorAll('.blog-card.revealed')],
      [...document.querySelectorAll('.nav-map-link')],
      [...document.querySelectorAll('.menu-dot-btn')],
    ];
    queue = [];
    groups.forEach(g => g.forEach(el => queue.push(el)));
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
  }

  function highlightNext() {
    if (idx === 0) buildQueue();
    if (!queue.length) { idx = 0; return; }
    const el = queue[idx % queue.length];
    idx++;
    if (!el || !document.body.contains(el)) return;
    if (el.classList.contains('tab') && el.classList.contains('active')) return;
    el.classList.add('auto-lit');
    setTimeout(() => el.classList.remove('auto-lit'), 900);
  }

  setTimeout(() => {
    setInterval(highlightNext, 1800);
  }, 2000);
})();

// ── LIVE MENU FROM GOOGLE SHEET ──
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2rSWCYiSi-gXHPkFY3ZvmMNLeqrabax6dO9Okdm4C3ecvw1-RLNciNvSTJebKlQM7nLmVkHmKq4ap/pub?gid=0&single=true&output=csv";
const DEFAULT_FALLBACK_IMAGE = "https://i.postimg.cc/tTf92z4s/Gemini-Generated-Image-3m9wp93m9wp93m9w.png";

const CATEGORY_STYLES = {
  "YEMENI MANDHI":  { label: "✦ Heritage Collection", title: "Yemeni Mandhi Dishes",    tab: "Yemeni Mandhi" },
  "GRILLED MANDHI": { label: "✦ Grilled Fusion",       title: "Grilled Mandhi",          tab: "Grilled Mandhi" },
  "GRILLED PIECES": { label: "✦ Pit-Charred Elements", title: "Grilled Charred Pieces",  tab: "Grilled Pieces" },
  "MANDHI PIECES":  { label: "✦ Pure Proteins",        title: "Mandhi Meat Side Pieces", tab: "Mandhi Pieces" },
  "FRESH JUICES":   { label: "✦ Fresh Juices",         title: "Fresh Juices",            tab: "Fresh Juices" }
};

let parsedMenuData = {};
let dynamicCategoryOrder = [];

async function initializeLiveKitchenMenu() {
  try {
    const res = await fetch(SHEET_CSV_URL);
    const csv = await res.text();
    const rows = csv.trim().split(/\r?\n/);
    if (rows.length < 2) return;

    const parseRow = (text) => text.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const headers = parseRow(rows[0]).map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());

    const nameIdx  = headers.findIndex(h => h.includes('name')     || h.includes('dish'));
    const catIdx   = headers.findIndex(h => h.includes('category') || h.includes('cat'));
    const qtrIdx   = headers.findIndex(h => h.includes('quarter')  || h.includes('qtr'));
    const halfIdx  = headers.findIndex(h => h.includes('half'));
    const fullIdx  = headers.findIndex(h => h.includes('full'));
    const tagIdx   = headers.findIndex(h => h.includes('tag')      || h.includes('badge'));
    const imageIdx = headers.findIndex(h => h.includes('image')    || h.includes('img') || h.includes('link'));

    parsedMenuData = {};
    dynamicCategoryOrder = [];

    rows.slice(1).forEach(row => {
      const cols = parseRow(row);
      if (cols.length < 2) return;
      const name = nameIdx !== -1 && cols[nameIdx] ? cols[nameIdx].replace(/^"|"$/g, '').trim() : '';
      const cat  = catIdx  !== -1 && cols[catIdx]  ? cols[catIdx].replace(/^"|"$/g, '').toUpperCase().trim() : '';
      if (!name || !cat) return;
      if (!parsedMenuData[cat]) { parsedMenuData[cat] = []; dynamicCategoryOrder.push(cat); }
      parsedMenuData[cat].push({
        name,
        qtr:   qtrIdx   !== -1 && cols[qtrIdx]   ? cols[qtrIdx].trim()                              : '',
        half:  halfIdx  !== -1 && cols[halfIdx]   ? cols[halfIdx].trim()                             : '',
        full:  fullIdx  !== -1 && cols[fullIdx]   ? cols[fullIdx].trim()                             : '',
        tag:   tagIdx   !== -1 && cols[tagIdx]    ? cols[tagIdx].replace(/^"|"$/g, '').trim()        : '',
        image: imageIdx !== -1 && cols[imageIdx]  ? cols[imageIdx].replace(/^"|"$/g, '').trim() || DEFAULT_FALLBACK_IMAGE : DEFAULT_FALLBACK_IMAGE
      });
    });

    renderDynamicWebLayout();
  } catch (err) {
    console.error("Menu load error:", err);
    document.getElementById('menuWrap').innerHTML = `<div style="text-align:center;padding:60px;color:var(--text-muted);font-family:var(--font-thematic);font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">✦ Could not connect to menu. Please refresh. ✦</div>`;
  }
}

function renderDynamicWebLayout() {
  const tabsContainer = document.getElementById('tabsContainer');
  const menuWrap = document.getElementById('menuWrap');
  if (!tabsContainer || !menuWrap) return;

  let tabsMarkup = '';
  dynamicCategoryOrder.forEach((cat, i) => {
    const style = CATEGORY_STYLES[cat] || {};
    tabsMarkup += `<button class="tab${i === 0 ? ' active' : ''}" onclick="switchTabPanel('${cat}',this)">${style.tab || cat}</button>`;
  });
  tabsContainer.innerHTML = tabsMarkup;

  let listsMarkup = '';
  dynamicCategoryOrder.forEach((cat, i) => {
    const style = CATEGORY_STYLES[cat] || {};
    let cards = '';
    (parsedMenuData[cat] || []).forEach(dish => {
      let priceRows = '';
      if (cat === "FRESH JUICES") {
        priceRows = `<div class="price-row"><span class="lbl">Per Glass</span><span class="val">₹${dish.full}</span></div>`;
      } else {
        if (dish.qtr)  priceRows += `<div class="price-row"><span class="lbl">Quarter</span><span class="val">₹${dish.qtr}</span></div>`;
        if (dish.half) priceRows += `<div class="price-row"><span class="lbl">Half</span><span class="val">₹${dish.half}</span></div>`;
        if (dish.full) priceRows += `<div class="price-row"><span class="lbl">Full</span><span class="val">₹${dish.full}</span></div>`;
      }
      const badge = dish.tag ? `<div class="card-badge">${dish.tag}</div>` : '';
      cards += `
        <div class="menu-card revealed">
          <div class="card-img-wrap">
            <img class="card-img" src="${dish.image}" alt="${dish.name}">
            ${badge}
          </div>
          <div class="card-body">
            <h3>${dish.name}</h3>
            <div class="price-table">${priceRows}</div>
          </div>
        </div>`;
    });

    listsMarkup += `
      <div id="cat-${cat.replace(/\s+/g, '-')}" class="cat-content${i === 0 ? ' active' : ''}">
        <p class="section-label">${style.label || ''}</p>
        <h2 class="section-title">${style.title || cat}</h2>
        <div class="section-divider"><div class="divider-line"></div><div class="divider-icon">✦</div><div class="divider-line"></div></div>
        <div class="menu-grid">${cards}</div>
      </div>`;
  });

  menuWrap.innerHTML = listsMarkup;
  runGridObservations();
}

document.addEventListener('DOMContentLoaded', initializeLiveKitchenMenu);
