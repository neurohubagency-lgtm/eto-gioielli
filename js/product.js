(function () {
  function getProductId() {
    return new URLSearchParams(window.location.search).get('id');
  }

  function formatPrice(p) { return p.toLocaleString('ru-RU') + ' у.е.'; }
  function renderPriceHtml(product) {
    if (product.promoPrice) {
      return `<div class="price-wrap">
        <span class="price-promo">${formatPrice(product.promoPrice)}</span>
        <span class="price-old">${formatPrice(product.price)}</span>
        <span class="price-badge">PROMO</span>
      </div>`;
    }
    return `<span class="product-price-val">${formatPrice(product.price)}</span>`;
  }

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

    const galleryMain = document.getElementById('galleryMain');
    const mainVideo = document.getElementById('galleryVideo');
    galleryMain.src = product.images[0];
    galleryMain.alt = product.name[lang];

    const thumbsEl = document.getElementById('galleryThumbs');
    let thumbsHtml = product.images.map((src, i) =>
      `<img src="${src}" class="gallery__thumb${i === 0 ? ' active' : ''}" data-type="img" data-src="${src}" alt="">`
    ).join('');
    if (product.video) {
      thumbsHtml += `<div class="gallery__thumb gallery__thumb--video" data-type="video" data-src="${product.video}">▶</div>`;
    }
    thumbsEl.innerHTML = thumbsHtml;
    thumbsEl.querySelectorAll('.gallery__thumb').forEach(th => {
      th.addEventListener('click', () => {
        thumbsEl.querySelectorAll('.gallery__thumb').forEach(t => t.classList.remove('active'));
        th.classList.add('active');
        if (th.dataset.type === 'video') {
          galleryMain.style.display = 'none';
          mainVideo.style.display = 'block';
          mainVideo.src = th.dataset.src;
          mainVideo.play();
        } else {
          mainVideo.style.display = 'none';
          mainVideo.pause();
          galleryMain.style.display = 'block';
          galleryMain.src = th.dataset.src;
        }
      });
    });

    const codeText = product.specs.code ? `код ${product.specs.code}, артикул ${product.specs.article}` : `артикул ${product.specs.article}`;
    document.getElementById('productArticle').textContent = codeText;
    document.getElementById('productName').textContent = product.name[lang];
    document.getElementById('productPrice').innerHTML = renderPriceHtml(product);
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
          ${p.promoPrice ? `<div class="card__price-wrap"><span class="card__price-promo">${formatPrice(p.promoPrice)}</span><span class="card__price-old">${formatPrice(p.price)}</span></div>` : `<div class="card__price">${formatPrice(p.price)}</div>`}
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
