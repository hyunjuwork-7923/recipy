// 카드/상세 페이지 공통 렌더링 로직

const PLACEHOLDER_ICON = `
<svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
  <path d="M7 2v7a2 2 0 0 0 2 2v11" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7 2v5M11 2v5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17 2c-1.5 0-3 2-3 6s1.5 6 3 6v8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

function imageOrPlaceholder(src, alt) {
  if (!src) return `<div class="placeholder-wrap">${PLACEHOLDER_ICON}</div>`;
  return `<img src="${src}" alt="${alt}" onerror="handleImageError(this)">`;
}

function handleImageError(imgEl) {
  imgEl.parentElement.innerHTML = PLACEHOLDER_ICON;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// ---------- 목록 페이지 ----------
function initGridPage() {
  const grid = document.getElementById("grid");
  const searchInput = document.getElementById("search-input");
  const filterRow = document.getElementById("filter-row");
  const countEl = document.getElementById("recipe-count");
  const footerUpdated = document.getElementById("footer-updated");

  countEl.textContent = RECIPES.length;
  const latestDate = RECIPES.map(r => r.dateAdded).filter(Boolean).sort().slice(-1)[0];
  footerUpdated.textContent = latestDate ? `Updated ${latestDate}` : "";

  const categories = ["전체", ...Array.from(new Set(RECIPES.map(r => r.category)))];
  let activeCategory = "전체";
  let keyword = "";

  filterRow.innerHTML = categories.map(cat =>
    `<button class="filter-pill${cat === "전체" ? " active" : ""}" data-cat="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`
  ).join("");

  filterRow.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-pill");
    if (!btn) return;
    activeCategory = btn.dataset.cat;
    filterRow.querySelectorAll(".filter-pill").forEach(b => b.classList.toggle("active", b === btn));
    render();
  });

  searchInput.addEventListener("input", (e) => {
    keyword = e.target.value.trim().toLowerCase();
    render();
  });

  function render() {
    const sorted = [...RECIPES].sort((a, b) => (b.dateAdded || "").localeCompare(a.dateAdded || ""));
    const filtered = sorted.filter(r => {
      const matchesCategory = activeCategory === "전체" || r.category === activeCategory;
      const haystack = [r.title, r.category, ...(r.tags || [])].join(" ").toLowerCase();
      const matchesKeyword = !keyword || haystack.includes(keyword);
      return matchesCategory && matchesKeyword;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="empty-state">조건에 맞는 레시피가 없어요.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(r => `
      <a class="card" href="recipe.html?id=${encodeURIComponent(r.id)}">
        <div class="card-image">
          ${imageOrPlaceholder(r.image, r.title)}
        </div>
        <div class="card-body">
          <span class="card-category">${escapeHtml(r.category)}</span>
          <h3 class="card-title">${escapeHtml(r.title)}</h3>
          <div class="card-meta">
            <span>${escapeHtml(r.time || "")}</span>
            <span>${escapeHtml(r.servings || "")}</span>
          </div>
          <div class="card-tags">
            ${(r.tags || []).map(t => `<span>#${escapeHtml(t)}</span>`).join(" ")}
          </div>
        </div>
      </a>
    `).join("");
  }

  render();
}

// ---------- 상세 페이지 ----------
function initDetailPage() {
  const wrap = document.getElementById("detail-wrap");
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const recipe = RECIPES.find(r => r.id === id);

  if (!recipe) {
    wrap.innerHTML = `
      <div class="top-bar"></div>
      <a class="back-link" href="index.html">&larr; 목록으로</a>
      <div class="not-found">레시피를 찾을 수 없어요.</div>
    `;
    return;
  }

  document.title = `${recipe.title} · 나의 레시피 북`;

  wrap.innerHTML = `
    <div class="top-bar"></div>
    <a class="back-link" href="index.html">&larr; 목록으로</a>
    <div class="detail-image">${imageOrPlaceholder(recipe.image, recipe.title)}</div>

    <div class="detail-body">
      <span class="detail-category">${escapeHtml(recipe.category)}</span>
      <h1 class="detail-title">${escapeHtml(recipe.title)}</h1>
      <div class="detail-meta">
        <span>Time ${escapeHtml(recipe.time || "-")}</span>
        <span>Serves ${escapeHtml(recipe.servings || "-")}</span>
      </div>
      <div class="detail-tags">
        ${(recipe.tags || []).map(t => `<span>#${escapeHtml(t)}</span>`).join(" ")}
      </div>
      ${recipe.memo ? `<div class="memo-box"><b>내 메모</b>${escapeHtml(recipe.memo)}</div>` : ""}
    </div>

    <section class="block">
      <div class="section-head">
        <span class="sec-num">01</span>
        <div class="sec-title-wrap">
          <div class="sec-eyebrow">Ingredients</div>
          <h2>재료</h2>
        </div>
      </div>
      <div class="head-rule"></div>
      <ul class="ingredient-list">
        ${(recipe.ingredients || []).map(i => `<li>${escapeHtml(i)}</li>`).join("")}
      </ul>
    </section>

    <section class="block">
      <div class="section-head">
        <span class="sec-num">02</span>
        <div class="sec-title-wrap">
          <div class="sec-eyebrow">Method</div>
          <h2>만드는 법</h2>
        </div>
      </div>
      <div class="head-rule"></div>
      <ol class="step-list">
        ${(recipe.steps || []).map(s => `<li>${escapeHtml(s)}</li>`).join("")}
      </ol>
    </section>

    <div class="detail-body">
      ${recipe.source ? `
        <div class="source-line">
          출처 — ${recipe.source.url
            ? `<a href="${escapeHtml(recipe.source.url)}" target="_blank" rel="noopener">${escapeHtml(recipe.source.name)}</a>`
            : escapeHtml(recipe.source.name)}
        </div>` : ""}
    </div>

    <div class="sheet-footer">
      <span>Personal Recipe Archive</span>
      <span>${escapeHtml(recipe.dateAdded || "")}</span>
    </div>
  `;
}
