(function () {
  function getProductId() {
    return new URLSearchParams(window.location.search).get('id');
  }

  function formatPrice(p) { return p.toLocaleString('ru-RU') + ' ₽'; }

  function getMetalLabel(id) {
    const m = CONFIG.metals.find(x => x.id === id);
    return m ? m[getLang()] : id;
  }

  function render() {
    const lang = getLang();
    const id = getProductId();
    const product = window.PRODUCTS.find(p => p.id === id);

    if (!product) {
      document.getElementById('productContent').innerHTML = `<p style="padding:80px 0;text-align:center;opacity:0.5">${t('not_found')}</p>`;
      return;
    }

    document.title = product.name[lang] + ' — Eto Gioielli';

    const mainImg = document.getElementById('galleryMain');
    mainImg.src = product.images[0];
    mainImg.alt = product.name[lang];

    const thumbsEl = document.getElementById('galleryThumbs');
    if (product.images.length > 1) {
      thumbsEl.innerHTML = product.images.map((src, i) =>
        `<img src="${src}" class="gallery__thumb${i === 0 ? ' active' : ''}" data-idx="${i}" alt="">`
      ).join('');
      thumbsEl.querySelectorAll('.gallery__thumb').forEach(th => {
        th.addEventListener('click', () => {
          mainImg.src = th.src;
          thumbsEl.querySelectorAll('.gallery__thumb').forEach(t => t.classList.remove('active'));
          th.classList.add('active');
        });
      });
    } else {
      thumbsEl.innerHTML = '';
    }

    document.getElementById('productArticle').textContent = product.specs.article;
    document.getElementById('productName').textContent = product.name[lang];
    document.getElementById('productPrice').textContent = formatPrice(product.price);
    document.getElementById('productDescription').textContent = product.description[lang];

    const specs = [
      ['product_metal',   getMetalLabel(product.specs.metal)],
      ['product_carat',   product.specs.carat || '—'],
      ['product_cut',     product.specs.cut],
      ['product_color',   product.specs.color],
      ['product_clarity', product.specs.clarity],
    ];
    document.getElementById('specsTable').innerHTML = specs.map(([key, val]) =>
      `<tr><td data-i18n="${key}">${t(key)}</td><td>${val}</td></tr>`
    ).join('');

    document.getElementById('productActions').innerHTML = `
      <a href="https://wa.me/${CONFIG.contact.whatsapp.replace(/\D/g,'')}" class="btn btn--whatsapp" target="_blank" data-i18n="btn_whatsapp">WhatsApp</a>
      <a href="https://t.me/${CONFIG.contact.telegram.replace('@','')}" class="btn btn--telegram" target="_blank" data-i18n="btn_telegram">Telegram</a>
    `;

    const similar = window.PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    if (similar.length) {
      document.getElementById('similarGrid').innerHTML = similar.map(p => `
        <a href="product.html?id=${p.id}" class="card">
          <div class="card__img"><img src="${p.images[0]}" alt="${p.name[lang]}" loading="lazy"></div>
          <div class="card__name">${p.name[lang]}</div>
          <div class="card__price">${formatPrice(p.price)}</div>
        </a>
      `).join('');
    } else {
      document.getElementById('similarSection').style.display = 'none';
    }

    applyTranslations(lang);
  }

  document.addEventListener('DOMContentLoaded', render);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', render);
  });
})();
