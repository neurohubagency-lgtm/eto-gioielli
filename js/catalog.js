(function () {
  let filtered = [];
  let currentPage = 1;
  const PER_PAGE = CONFIG.catalog.perPage;
  let activeCategory = 'all';
  let activeMetal = 'all';
  let maxPriceVal = 0;
  let caratMax = 0;

  function init() {
    window.PRODUCTS.forEach(p => {
      if (p.price > maxPriceVal) maxPriceVal = p.price;
      if (p.specs.carat > caratMax) caratMax = p.specs.carat;
    });

    renderCategories();
    renderMetals();
    setupPriceSlider();
    setupCaratSlider();
    setupSearch();
    applyFilters();
  }

  function renderCategories() {
    const lang = getLang();
    const container = document.getElementById('categoryTags');
    container.innerHTML = CONFIG.categories.map(c =>
      `<button class="tag${c.id === activeCategory ? ' active' : ''}" data-cat="${c.id}">${c[lang]}</button>`
    ).join('');
    container.querySelectorAll('.tag').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        container.querySelectorAll('.tag').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPage = 1;
        applyFilters();
      });
    });
  }

  function renderMetals() {
    const lang = getLang();
    const sel = document.getElementById('metalSelect');
    sel.innerHTML = CONFIG.metals.map(m => `<option value="${m.id}">${m[lang]}</option>`).join('');
    sel.addEventListener('change', () => { activeMetal = sel.value; currentPage = 1; applyFilters(); });
  }

  function setupPriceSlider() {
    const slider = document.getElementById('priceSlider');
    const display = document.getElementById('priceValue');
    slider.max = maxPriceVal;
    slider.value = maxPriceVal;
    display.textContent = (maxPriceVal / 1000).toFixed(0) + 'к ₽';
    slider.addEventListener('input', () => {
      display.textContent = (parseInt(slider.value) / 1000).toFixed(0) + 'к ₽';
      currentPage = 1;
      applyFilters();
    });
  }

  function setupCaratSlider() {
    const slider = document.getElementById('caratSlider');
    const display = document.getElementById('caratValue');
    slider.max = caratMax;
    slider.step = 0.05;
    slider.value = caratMax;
    display.textContent = caratMax.toFixed(2);
    slider.addEventListener('input', () => {
      display.textContent = parseFloat(slider.value).toFixed(2);
      currentPage = 1;
      applyFilters();
    });
  }

  function setupSearch() {
    document.getElementById('searchInput').addEventListener('input', () => {
      currentPage = 1;
      applyFilters();
    });
  }

  function applyFilters() {
    const lang = getLang();
    const query = document.getElementById('searchInput').value.toLowerCase();
    const maxPrice = parseInt(document.getElementById('priceSlider').value);
    const maxCarat = parseFloat(document.getElementById('caratSlider').value);

    filtered = window.PRODUCTS.filter(p => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (activeMetal !== 'all' && p.specs.metal !== activeMetal) return false;
      if (p.price > maxPrice) return false;
      if (p.specs.carat > maxCarat) return false;
      if (query && !p.name[lang].toLowerCase().includes(query) && !p.specs.article.toLowerCase().includes(query)) return false;
      return true;
    });

    document.getElementById('itemsCount').textContent = filtered.length + ' ' + t('items_count');
    renderGrid();
    renderPagination();
  }

  function formatPrice(p) { return p.toLocaleString('ru-RU') + ' ₽'; }

  function renderGrid() {
    const lang = getLang();
    const start = (currentPage - 1) * PER_PAGE;
    const page = filtered.slice(start, start + PER_PAGE);
    const grid = document.getElementById('catalogGrid');

    if (page.length === 0) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;opacity:0.5;padding:60px 0;">Ничего не найдено</p>';
      return;
    }
    grid.innerHTML = page.map(p => `
      <a href="product.html?id=${p.id}" class="card">
        <div class="card__img"><img src="${p.images[0]}" alt="${p.name[lang]}" loading="lazy"></div>
        <div class="card__name">${p.name[lang]}</div>
        <div class="card__price">${formatPrice(p.price)}</div>
      </a>
    `).join('');
  }

  function renderPagination() {
    const total = Math.ceil(filtered.length / PER_PAGE);
    const pg = document.getElementById('pagination');
    if (total <= 1) { pg.innerHTML = ''; return; }

    let html = `<button class="page-btn page-nav" ${currentPage === 1 ? 'disabled' : ''} onclick="goPage(${currentPage - 1})" data-i18n="pagination_prev">Назад</button>`;
    for (let i = 1; i <= total; i++) {
      if (total > 7 && i > 2 && i < total - 1 && Math.abs(i - currentPage) > 1) {
        if (i === 3 || i === total - 2) html += '<span style="padding:0 4px;opacity:0.4">…</span>';
        continue;
      }
      html += `<button class="page-btn${i === currentPage ? ' active' : ''}" onclick="goPage(${i})">${i}</button>`;
    }
    html += `<button class="page-btn page-nav" ${currentPage === total ? 'disabled' : ''} onclick="goPage(${currentPage + 1})" data-i18n="pagination_next">Вперёд</button>`;
    pg.innerHTML = html;
    applyTranslations(getLang());
  }

  window.goPage = function (n) {
    currentPage = n;
    renderGrid();
    renderPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      renderCategories();
      renderMetals();
      applyFilters();
    });
  });

  document.addEventListener('DOMContentLoaded', init);
})();
