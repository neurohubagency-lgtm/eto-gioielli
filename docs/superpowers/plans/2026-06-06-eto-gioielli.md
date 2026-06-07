# Eto Gioielli Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать статический сайт-каталог ювелирного бренда Eto Gioielli с фильтрацией, пагинацией и переключением RU/EN.

**Architecture:** Multi-page static site (HTML + CSS + vanilla JS). Все товары хранятся в `data/products.js` как глобальный JS-массив. Фильтрация и пагинация — клиентская. Язык — localStorage + data-i18n атрибуты.

**Tech Stack:** HTML5, CSS3 (custom properties), Vanilla JS (ES6+), Google Fonts (Cormorant Garamond + Inter)

---

## Карта файлов

| Файл | Ответственность |
|---|---|
| `js/config.js` | Контакты бренда, глобальные настройки |
| `js/i18n.js` | Переводы RU/EN, функция применения переводов |
| `data/products.js` | Массив `window.PRODUCTS` — все товары |
| `css/style.css` | Design tokens, типографика, шапка, карточки, кнопки, пагинация, адаптив |
| `index.html` | Главная: hero, о бренде, featured, контакт |
| `catalog.html` | Каталог: фильтры, сетка, пагинация |
| `js/catalog.js` | Логика фильтрации, поиска, пагинации |
| `product.html` | Страница товара: галерея, характеристики, похожие |
| `js/product.js` | Загрузка товара по URL ?id=, рендер галереи и похожих |
| `about.html` | О бренде |
| `assets/placeholder.jpg` | Заглушка для фото |
| `assets/logo.svg` | Логотип (добавит владелец) |

---

## Task 1: Структура проекта

**Files:**
- Create: `projects/eto-gioielli/` (все папки и пустые файлы)

- [ ] **Step 1: Создать папки**

```powershell
New-Item -ItemType Directory -Force "projects/eto-gioielli/data"
New-Item -ItemType Directory -Force "projects/eto-gioielli/assets/images"
New-Item -ItemType Directory -Force "projects/eto-gioielli/css"
New-Item -ItemType Directory -Force "projects/eto-gioielli/js"
```

- [ ] **Step 2: Создать placeholder.jpg**

Скачать любое светлое изображение 800×800 и сохранить как `projects/eto-gioielli/assets/placeholder.jpg`.

Или создать SVG-заглушку `projects/eto-gioielli/assets/placeholder.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#E8E8E8"/>
  <text x="400" y="420" font-family="Inter,sans-serif" font-size="32" fill="#C0C0C0" text-anchor="middle">Eto Gioielli</text>
</svg>
```

- [ ] **Step 3: Создать logo.svg (временный)**

`projects/eto-gioielli/assets/logo.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="40" viewBox="0 0 200 40">
  <text x="0" y="30" font-family="Cormorant Garamond,serif" font-size="28" fill="#1A1A2E" letter-spacing="3">ETO GIOIELLI</text>
</svg>
```

- [ ] **Step 4: Инициализировать git**

```powershell
cd projects/eto-gioielli
git init
git add .
git commit -m "chore: project structure"
```

---

## Task 2: config.js

**Files:**
- Create: `projects/eto-gioielli/js/config.js`

- [ ] **Step 1: Написать config.js**

`js/config.js`:
```js
const CONFIG = {
  brand: 'Eto Gioielli',
  contact: {
    whatsapp: '+79001234567',
    telegram: '@etogioielli'
  },
  catalog: {
    perPage: 24
  },
  categories: [
    { id: 'all',       ru: 'Все',       en: 'All' },
    { id: 'rings',     ru: 'Кольца',    en: 'Rings' },
    { id: 'earrings',  ru: 'Серьги',    en: 'Earrings' },
    { id: 'necklaces', ru: 'Колье',     en: 'Necklaces' },
    { id: 'bracelets', ru: 'Браслеты',  en: 'Bracelets' },
    { id: 'pendants',  ru: 'Подвески',  en: 'Pendants' },
    { id: 'brooches',  ru: 'Броши',     en: 'Brooches' },
    { id: 'chains',    ru: 'Цепочки',   en: 'Chains' }
  ],
  metals: [
    { id: 'all',      ru: 'Все',              en: 'All' },
    { id: 'wg18',     ru: 'Белое золото 18K', en: 'White Gold 18K' },
    { id: 'yg18',     ru: 'Жёлтое золото 18K',en: 'Yellow Gold 18K' },
    { id: 'pt950',    ru: 'Платина 950',      en: 'Platinum 950' }
  ]
};
```

- [ ] **Step 2: Commit**

```bash
git add js/config.js
git commit -m "feat: add config.js"
```

---

## Task 3: i18n.js

**Files:**
- Create: `projects/eto-gioielli/js/i18n.js`

- [ ] **Step 1: Написать i18n.js**

`js/i18n.js`:
```js
const TRANSLATIONS = {
  ru: {
    nav_catalog:    'Каталог',
    nav_about:      'О бренде',
    nav_contact:    'Контакт',
    hero_tagline:   'Рождённые в лаборатории. Созданные для вечности.',
    hero_btn:       'Смотреть каталог',
    about_title:    'Eto Gioielli',
    about_text:     'Украшения из лабораторных бриллиантов — такие же настоящие, но без экологического вреда и по справедливой цене.',
    feat1_title:    'Экология',
    feat1_text:     'Нулевой вред природе',
    feat2_title:    'Качество',
    feat2_text:     'Сертифицированные камни',
    feat3_title:    'Цена',
    feat3_text:     'Честная стоимость',
    featured_title: 'Коллекции',
    contact_title:  'Связаться с нами',
    btn_whatsapp:   'WhatsApp',
    btn_telegram:   'Telegram',
    catalog_title:  'Каталог украшений',
    search_placeholder: 'Поиск по названию или артикулу...',
    filter_price:   'Цена',
    filter_metal:   'Металл',
    filter_carat:   'Карат',
    btn_apply:      'Применить',
    btn_reset:      'Сбросить',
    pagination_prev:'Назад',
    pagination_next:'Вперёд',
    product_article:'Артикул',
    product_metal:  'Металл',
    product_carat:  'Карат',
    product_cut:    'Огранка',
    product_color:  'Цвет',
    product_clarity:'Чистота',
    product_price:  'Цена',
    product_inquire:'Узнать о заказе',
    similar_title:  'Похожие украшения',
    about_page_title: 'О бренде',
    about_lab_title:  'Почему лабораторные бриллианты?',
    footer_rights:    '© 2024 Eto Gioielli. Все права защищены.',
    not_found:        'Товар не найден',
    items_count:      'украшений'
  },
  en: {
    nav_catalog:    'Catalog',
    nav_about:      'About',
    nav_contact:    'Contact',
    hero_tagline:   'Born in a lab. Made for eternity.',
    hero_btn:       'View Catalog',
    about_title:    'Eto Gioielli',
    about_text:     'Lab-grown diamond jewelry — as real as mined diamonds, with zero environmental impact and honest pricing.',
    feat1_title:    'Ecology',
    feat1_text:     'Zero harm to nature',
    feat2_title:    'Quality',
    feat2_text:     'Certified stones',
    feat3_title:    'Price',
    feat3_text:     'Fair value',
    featured_title: 'Collections',
    contact_title:  'Contact Us',
    btn_whatsapp:   'WhatsApp',
    btn_telegram:   'Telegram',
    catalog_title:  'Jewelry Catalog',
    search_placeholder: 'Search by name or article...',
    filter_price:   'Price',
    filter_metal:   'Metal',
    filter_carat:   'Carat',
    btn_apply:      'Apply',
    btn_reset:      'Reset',
    pagination_prev:'Back',
    pagination_next:'Next',
    product_article:'Article',
    product_metal:  'Metal',
    product_carat:  'Carat',
    product_cut:    'Cut',
    product_color:  'Color',
    product_clarity:'Clarity',
    product_price:  'Price',
    product_inquire:'Inquire About Order',
    similar_title:  'Similar Jewelry',
    about_page_title: 'About',
    about_lab_title:  'Why Lab-Grown Diamonds?',
    footer_rights:    '© 2024 Eto Gioielli. All rights reserved.',
    not_found:        'Product not found',
    items_count:      'items'
  }
};

function getLang() {
  return localStorage.getItem('lang') || 'ru';
}

function setLang(lang) {
  localStorage.setItem('lang', lang);
  applyTranslations(lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function applyTranslations(lang) {
  const t = TRANSLATIONS[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });
}

function t(key) {
  return TRANSLATIONS[getLang()][key] || key;
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations(getLang());
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
    btn.classList.toggle('active', btn.dataset.lang === getLang());
  });
});
```

- [ ] **Step 2: Commit**

```bash
git add js/i18n.js
git commit -m "feat: add i18n RU/EN"
```

---

## Task 4: data/products.js

**Files:**
- Create: `projects/eto-gioielli/data/products.js`

- [ ] **Step 1: Создать products.js с 15 тестовыми товарами**

`data/products.js` (15 placeholder-товаров, по 2 на категорию + лишний):
```js
window.PRODUCTS = [
  {
    id: 'ring-001',
    category: 'rings',
    name: { ru: 'Кольцо Aurora', en: 'Aurora Ring' },
    description: { ru: 'Элегантное кольцо с бриллиантом огранки «круг». Белое золото 18K.', en: 'Elegant ring with round brilliant cut diamond. 18K white gold.' },
    price: 45000,
    currency: 'RUB',
    images: ['assets/placeholder.svg'],
    specs: { metal: 'wg18', carat: 0.5, cut: 'Brilliant', color: 'D', clarity: 'VVS1', article: 'EG-R-001' },
    featured: true
  },
  {
    id: 'ring-002',
    category: 'rings',
    name: { ru: 'Кольцо Stella', en: 'Stella Ring' },
    description: { ru: 'Кольцо с бриллиантом «принцесса». Жёлтое золото 18K.', en: 'Princess cut diamond ring. 18K yellow gold.' },
    price: 62000,
    currency: 'RUB',
    images: ['assets/placeholder.svg'],
    specs: { metal: 'yg18', carat: 0.75, cut: 'Princess', color: 'E', clarity: 'VS1', article: 'EG-R-002' },
    featured: false
  },
  {
    id: 'earr-001',
    category: 'earrings',
    name: { ru: 'Серьги Luna', en: 'Luna Earrings' },
    description: { ru: 'Серьги-пусеты с бриллиантами. Белое золото 18K.', en: 'Diamond stud earrings. 18K white gold.' },
    price: 38000,
    currency: 'RUB',
    images: ['assets/placeholder.svg'],
    specs: { metal: 'wg18', carat: 0.4, cut: 'Brilliant', color: 'F', clarity: 'VS2', article: 'EG-E-001' },
    featured: true
  },
  {
    id: 'earr-002',
    category: 'earrings',
    name: { ru: 'Серьги Cascade', en: 'Cascade Earrings' },
    description: { ru: 'Длинные серьги с дорожкой бриллиантов. Платина 950.', en: 'Long drop earrings with diamond row. Platinum 950.' },
    price: 89000,
    currency: 'RUB',
    images: ['assets/placeholder.svg'],
    specs: { metal: 'pt950', carat: 1.2, cut: 'Brilliant', color: 'D', clarity: 'VVS2', article: 'EG-E-002' },
    featured: false
  },
  {
    id: 'neck-001',
    category: 'necklaces',
    name: { ru: 'Колье Celeste', en: 'Celeste Necklace' },
    description: { ru: 'Колье-чокер с бриллиантовой дорожкой. Белое золото 18K.', en: 'Diamond choker necklace. 18K white gold.' },
    price: 125000,
    currency: 'RUB',
    images: ['assets/placeholder.svg'],
    specs: { metal: 'wg18', carat: 2.0, cut: 'Brilliant', color: 'E', clarity: 'VVS1', article: 'EG-N-001' },
    featured: true
  },
  {
    id: 'neck-002',
    category: 'necklaces',
    name: { ru: 'Колье Soleil', en: 'Soleil Necklace' },
    description: { ru: 'Подвеска-солнце на цепочке. Жёлтое золото 18K.', en: 'Sun pendant necklace. 18K yellow gold.' },
    price: 54000,
    currency: 'RUB',
    images: ['assets/placeholder.svg'],
    specs: { metal: 'yg18', carat: 0.3, cut: 'Round', color: 'G', clarity: 'VS1', article: 'EG-N-002' },
    featured: false
  },
  {
    id: 'brac-001',
    category: 'bracelets',
    name: { ru: 'Браслет Infinity', en: 'Infinity Bracelet' },
    description: { ru: 'Браслет с бриллиантовой дорожкой. Белое золото 18K.', en: 'Diamond tennis bracelet. 18K white gold.' },
    price: 180000,
    currency: 'RUB',
    images: ['assets/placeholder.svg'],
    specs: { metal: 'wg18', carat: 3.5, cut: 'Brilliant', color: 'D', clarity: 'VS1', article: 'EG-B-001' },
    featured: true
  },
  {
    id: 'brac-002',
    category: 'bracelets',
    name: { ru: 'Браслет Dew', en: 'Dew Bracelet' },
    description: { ru: 'Тонкий браслет с одним бриллиантом. Платина 950.', en: 'Thin bracelet with single diamond. Platinum 950.' },
    price: 42000,
    currency: 'RUB',
    images: ['assets/placeholder.svg'],
    specs: { metal: 'pt950', carat: 0.25, cut: 'Oval', color: 'E', clarity: 'VVS2', article: 'EG-B-002' },
    featured: false
  },
  {
    id: 'pend-001',
    category: 'pendants',
    name: { ru: 'Подвеска Nova', en: 'Nova Pendant' },
    description: { ru: 'Подвеска со звездой и бриллиантами. Белое золото 18K.', en: 'Star pendant with diamonds. 18K white gold.' },
    price: 28000,
    currency: 'RUB',
    images: ['assets/placeholder.svg'],
    specs: { metal: 'wg18', carat: 0.15, cut: 'Brilliant', color: 'F', clarity: 'VS2', article: 'EG-P-001' },
    featured: true
  },
  {
    id: 'pend-002',
    category: 'pendants',
    name: { ru: 'Подвеска Drop', en: 'Drop Pendant' },
    description: { ru: 'Подвеска-капля с бриллиантом. Жёлтое золото 18K.', en: 'Teardrop diamond pendant. 18K yellow gold.' },
    price: 35000,
    currency: 'RUB',
    images: ['assets/placeholder.svg'],
    specs: { metal: 'yg18', carat: 0.2, cut: 'Pear', color: 'G', clarity: 'VS1', article: 'EG-P-002' },
    featured: false
  },
  {
    id: 'broo-001',
    category: 'brooches',
    name: { ru: 'Брошь Fleur', en: 'Fleur Brooch' },
    description: { ru: 'Брошь-цветок с бриллиантами. Белое золото 18K.', en: 'Flower brooch with diamonds. 18K white gold.' },
    price: 95000,
    currency: 'RUB',
    images: ['assets/placeholder.svg'],
    specs: { metal: 'wg18', carat: 1.8, cut: 'Brilliant', color: 'E', clarity: 'VVS1', article: 'EG-BR-001' },
    featured: false
  },
  {
    id: 'broo-002',
    category: 'brooches',
    name: { ru: 'Брошь Comet', en: 'Comet Brooch' },
    description: { ru: 'Брошь-комета. Платина 950.', en: 'Comet brooch. Platinum 950.' },
    price: 72000,
    currency: 'RUB',
    images: ['assets/placeholder.svg'],
    specs: { metal: 'pt950', carat: 0.9, cut: 'Marquise', color: 'D', clarity: 'VVS2', article: 'EG-BR-002' },
    featured: false
  },
  {
    id: 'chain-001',
    category: 'chains',
    name: { ru: 'Цепочка Classic', en: 'Classic Chain' },
    description: { ru: 'Классическая цепочка плетения «Якорь». Белое золото 18K.', en: 'Classic anchor chain. 18K white gold.' },
    price: 22000,
    currency: 'RUB',
    images: ['assets/placeholder.svg'],
    specs: { metal: 'wg18', carat: 0, cut: '—', color: '—', clarity: '—', article: 'EG-C-001' },
    featured: false
  },
  {
    id: 'chain-002',
    category: 'chains',
    name: { ru: 'Цепочка Figaro', en: 'Figaro Chain' },
    description: { ru: 'Цепочка плетения «Фигаро». Жёлтое золото 18K.', en: 'Figaro chain. 18K yellow gold.' },
    price: 19000,
    currency: 'RUB',
    images: ['assets/placeholder.svg'],
    specs: { metal: 'yg18', carat: 0, cut: '—', color: '—', clarity: '—', article: 'EG-C-002' },
    featured: false
  },
  {
    id: 'ring-003',
    category: 'rings',
    name: { ru: 'Кольцо Orion', en: 'Orion Ring' },
    description: { ru: 'Кольцо с тремя бриллиантами «прошлое, настоящее, будущее». Белое золото 18K.', en: 'Three-stone ring "past, present, future". 18K white gold.' },
    price: 98000,
    currency: 'RUB',
    images: ['assets/placeholder.svg'],
    specs: { metal: 'wg18', carat: 1.5, cut: 'Brilliant', color: 'D', clarity: 'VVS1', article: 'EG-R-003' },
    featured: true
  }
];
```

- [ ] **Step 2: Commit**

```bash
git add data/products.js
git commit -m "feat: add sample product data (15 items)"
```

---

## Task 5: style.css

**Files:**
- Create: `projects/eto-gioielli/css/style.css`

- [ ] **Step 1: Написать style.css**

`css/style.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500&display=swap');

/* ── Design Tokens ── */
:root {
  --bg:         #FFFFFF;
  --text:       #1A1A2E;
  --accent:     #1E3A8A;
  --accent-hover: #2563EB;
  --silver:     #C0C0C0;
  --silver-light: #E8E8E8;
  --radius:     2px;
  --font-head:  'Cormorant Garamond', serif;
  --font-body:  'Inter', sans-serif;
  --max-w:      1280px;
  --header-h:   72px;
}

/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: var(--font-body); color: var(--text); background: var(--bg); font-size: 16px; line-height: 1.6; }
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; font-family: var(--font-body); }

/* ── Typography ── */
h1, h2, h3, h4 { font-family: var(--font-head); font-weight: 500; line-height: 1.2; }
h1 { font-size: clamp(2.5rem, 5vw, 4rem); letter-spacing: 0.02em; }
h2 { font-size: clamp(1.8rem, 3vw, 2.5rem); }
h3 { font-size: 1.4rem; }

/* ── Layout ── */
.container { max-width: var(--max-w); margin: 0 auto; padding: 0 24px; }
.section { padding: 80px 0; }

/* ── Header ── */
.header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  height: var(--header-h); display: flex; align-items: center;
  transition: background 0.3s, box-shadow 0.3s;
}
.header--solid { background: var(--bg); box-shadow: 0 1px 0 var(--silver-light); }
.header--transparent { background: transparent; }
.header .container { display: flex; align-items: center; justify-content: space-between; width: 100%; }
.header__logo img { height: 32px; }
.header__logo span { font-family: var(--font-head); font-size: 1.5rem; letter-spacing: 3px; }
.nav { display: flex; align-items: center; gap: 32px; }
.nav a { font-size: 0.875rem; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.7; transition: opacity 0.2s; }
.nav a:hover { opacity: 1; }
.lang-switcher { display: flex; gap: 4px; margin-left: 16px; }
.lang-btn {
  background: none; border: 1px solid var(--silver); padding: 4px 10px;
  font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
  border-radius: var(--radius); transition: all 0.2s; color: var(--text);
}
.lang-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }
.lang-btn:hover:not(.active) { border-color: var(--accent); color: var(--accent); }

/* ── Burger (mobile) ── */
.burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; padding: 4px; }
.burger span { display: block; width: 24px; height: 2px; background: var(--text); transition: all 0.3s; }
.mobile-nav { display: none; }

/* ── Buttons ── */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 28px; font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase;
  border-radius: var(--radius); border: none; transition: all 0.2s; font-weight: 500;
}
.btn--primary { background: var(--accent); color: #fff; }
.btn--primary:hover { background: var(--accent-hover); }
.btn--outline { background: transparent; color: var(--text); border: 1px solid var(--text); }
.btn--outline:hover { background: var(--text); color: #fff; }
.btn--whatsapp { background: #25D366; color: #fff; }
.btn--whatsapp:hover { background: #1EBE5C; }
.btn--telegram { background: #0088CC; color: #fff; }
.btn--telegram:hover { background: #0070A8; }

/* ── Hero ── */
.hero {
  min-height: 100vh; display: flex; align-items: center;
  background: linear-gradient(135deg, #f8f9ff 0%, #eef2ff 50%, #f0f4ff 100%);
  padding-top: var(--header-h);
}
.hero__content { max-width: 640px; }
.hero__tagline { font-size: 0.875rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 24px; }
.hero h1 { margin-bottom: 32px; }
.hero__buttons { display: flex; gap: 16px; flex-wrap: wrap; }

/* ── Features ── */
.features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 48px; }
.feature { text-align: center; padding: 32px 24px; border: 1px solid var(--silver-light); }
.feature__icon { font-size: 2rem; margin-bottom: 16px; }
.feature h3 { margin-bottom: 8px; }
.feature p { font-size: 0.875rem; opacity: 0.7; }

/* ── Product Card ── */
.products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.card { display: block; }
.card__img { aspect-ratio: 1; overflow: hidden; background: var(--silver-light); margin-bottom: 12px; }
.card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.card:hover .card__img img { transform: scale(1.05); }
.card__name { font-family: var(--font-head); font-size: 1.1rem; margin-bottom: 4px; }
.card__price { font-size: 0.875rem; color: var(--accent); font-weight: 500; }

/* ── Section titles ── */
.section-title { text-align: center; margin-bottom: 48px; }
.section-title h2 { margin-bottom: 12px; }
.section-title p { opacity: 0.6; max-width: 480px; margin: 0 auto; }

/* ── Contact block ── */
.contact-block { text-align: center; padding: 80px 0; background: var(--silver-light); }
.contact-block h2 { margin-bottom: 32px; }
.contact-buttons { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }

/* ── Catalog filters ── */
.catalog-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
.catalog-count { font-size: 0.875rem; opacity: 0.6; }
.search-bar { position: relative; }
.search-bar input {
  width: 320px; padding: 10px 16px 10px 40px;
  border: 1px solid var(--silver); border-radius: var(--radius);
  font-family: var(--font-body); font-size: 0.875rem; outline: none;
  transition: border-color 0.2s;
}
.search-bar input:focus { border-color: var(--accent); }
.search-bar__icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.4; pointer-events: none; }
.filters { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; align-items: center; }
.filter-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tag {
  padding: 6px 16px; border: 1px solid var(--silver);
  border-radius: var(--radius); font-size: 0.8rem; letter-spacing: 0.05em;
  background: none; color: var(--text); transition: all 0.2s; cursor: pointer;
}
.tag.active { background: var(--accent); border-color: var(--accent); color: #fff; }
.tag:hover:not(.active) { border-color: var(--accent); color: var(--accent); }
.filter-group { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; }
.filter-group label { opacity: 0.6; white-space: nowrap; }
.filter-group input[type="range"] { width: 100px; accent-color: var(--accent); }
.filter-group select {
  padding: 6px 12px; border: 1px solid var(--silver); border-radius: var(--radius);
  font-family: var(--font-body); font-size: 0.8rem; outline: none; background: var(--bg);
}
.filter-value { font-size: 0.8rem; min-width: 48px; }

/* ── Pagination ── */
.pagination { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 48px; }
.page-btn {
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--silver); border-radius: var(--radius);
  background: none; font-size: 0.875rem; transition: all 0.2s; cursor: pointer;
}
.page-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }
.page-btn:hover:not(.active):not(:disabled) { border-color: var(--accent); color: var(--accent); }
.page-btn:disabled { opacity: 0.3; cursor: default; }
.page-nav { padding: 0 12px; }

/* ── Product page ── */
.product-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; padding-top: calc(var(--header-h) + 40px); }
.gallery__main { aspect-ratio: 1; overflow: hidden; background: var(--silver-light); margin-bottom: 12px; }
.gallery__main img { width: 100%; height: 100%; object-fit: cover; }
.gallery__thumbs { display: flex; gap: 8px; }
.gallery__thumb {
  width: 72px; height: 72px; object-fit: cover; cursor: pointer;
  border: 2px solid transparent; transition: border-color 0.2s;
}
.gallery__thumb.active { border-color: var(--accent); }
.product-info { position: sticky; top: calc(var(--header-h) + 40px); }
.product-article { font-size: 0.75rem; letter-spacing: 0.15em; opacity: 0.4; text-transform: uppercase; margin-bottom: 8px; }
.product-info h1 { font-size: clamp(1.8rem, 3vw, 2.5rem); margin-bottom: 16px; }
.product-price { font-size: 1.5rem; color: var(--accent); font-weight: 500; margin-bottom: 32px; }
.specs-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
.specs-table tr { border-bottom: 1px solid var(--silver-light); }
.specs-table td { padding: 10px 0; font-size: 0.875rem; }
.specs-table td:first-child { opacity: 0.5; width: 40%; }
.product-description { font-size: 0.9375rem; opacity: 0.7; line-height: 1.7; margin-bottom: 32px; }
.product-actions { display: flex; gap: 12px; flex-wrap: wrap; }

/* ── Similar ── */
.similar { padding: 64px 0; }

/* ── About ── */
.about-hero { padding: calc(var(--header-h) + 80px) 0 80px; }
.about-content { max-width: 720px; }
.about-content h1 { margin-bottom: 32px; }
.about-content p { font-size: 1rem; opacity: 0.75; line-height: 1.8; margin-bottom: 24px; }
.why-lab { background: var(--silver-light); padding: 80px 0; }
.why-lab h2 { margin-bottom: 48px; }
.why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.why-item h3 { margin-bottom: 12px; font-size: 1.1rem; }
.why-item p { font-size: 0.875rem; opacity: 0.7; line-height: 1.7; }

/* ── Footer ── */
.footer { background: var(--text); color: #fff; padding: 32px 0; }
.footer__inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.footer__brand { font-family: var(--font-head); font-size: 1.25rem; letter-spacing: 2px; }
.footer__rights { font-size: 0.8rem; opacity: 0.4; }
.footer__links { display: flex; gap: 16px; }
.footer__links a { font-size: 0.8rem; opacity: 0.5; transition: opacity 0.2s; }
.footer__links a:hover { opacity: 1; }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .products-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .nav { display: none; }
  .burger { display: flex; }
  .mobile-nav.open { display: flex; flex-direction: column; gap: 24px; position: fixed; top: var(--header-h); left: 0; right: 0; background: var(--bg); padding: 32px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); z-index: 99; }
  .mobile-nav a { font-size: 1.1rem; letter-spacing: 0.05em; }
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .features { grid-template-columns: 1fr; }
  .product-layout { grid-template-columns: 1fr; gap: 32px; }
  .product-info { position: static; }
  .search-bar input { width: 100%; }
  .catalog-header { flex-direction: column; align-items: flex-start; }
  .why-grid { grid-template-columns: 1fr; }
  .footer__inner { flex-direction: column; text-align: center; }
}
@media (max-width: 480px) {
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .section { padding: 48px 0; }
}
```

- [ ] **Step 2: Commit**

```bash
git add css/style.css
git commit -m "feat: add design system CSS"
```

---

## Task 6: index.html

**Files:**
- Create: `projects/eto-gioielli/index.html`

- [ ] **Step 1: Написать index.html**

`index.html`:
```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eto Gioielli — Украшения из лабораторных бриллиантов</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <!-- Header -->
  <header class="header header--transparent" id="header">
    <div class="container">
      <a href="index.html" class="header__logo">
        <img src="assets/logo.svg" alt="Eto Gioielli" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
        <span style="display:none">ETO GIOIELLI</span>
      </a>
      <nav class="nav">
        <a href="catalog.html" data-i18n="nav_catalog">Каталог</a>
        <a href="about.html" data-i18n="nav_about">О бренде</a>
        <a href="#contact" data-i18n="nav_contact">Контакт</a>
        <div class="lang-switcher">
          <button class="lang-btn" data-lang="ru">RU</button>
          <button class="lang-btn" data-lang="en">EN</button>
        </div>
      </nav>
      <button class="burger" id="burger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <nav class="mobile-nav" id="mobileNav">
      <a href="catalog.html" data-i18n="nav_catalog">Каталог</a>
      <a href="about.html" data-i18n="nav_about">О бренде</a>
      <a href="#contact" data-i18n="nav_contact">Контакт</a>
      <div class="lang-switcher">
        <button class="lang-btn" data-lang="ru">RU</button>
        <button class="lang-btn" data-lang="en">EN</button>
      </div>
    </nav>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="container">
      <div class="hero__content">
        <p class="hero__tagline">Eto Gioielli</p>
        <h1 data-i18n="hero_tagline">Рождённые в лаборатории. Созданные для вечности.</h1>
        <div class="hero__buttons">
          <a href="catalog.html" class="btn btn--primary" data-i18n="hero_btn">Смотреть каталог</a>
        </div>
      </div>
    </div>
  </section>

  <!-- About / Features -->
  <section class="section">
    <div class="container">
      <div class="section-title">
        <h2 data-i18n="about_title">Eto Gioielli</h2>
        <p data-i18n="about_text">Украшения из лабораторных бриллиантов — такие же настоящие, но без экологического вреда и по справедливой цене.</p>
      </div>
      <div class="features">
        <div class="feature">
          <div class="feature__icon">🌿</div>
          <h3 data-i18n="feat1_title">Экология</h3>
          <p data-i18n="feat1_text">Нулевой вред природе</p>
        </div>
        <div class="feature">
          <div class="feature__icon">💎</div>
          <h3 data-i18n="feat2_title">Качество</h3>
          <p data-i18n="feat2_text">Сертифицированные камни</p>
        </div>
        <div class="feature">
          <div class="feature__icon">✦</div>
          <h3 data-i18n="feat3_title">Цена</h3>
          <p data-i18n="feat3_text">Честная стоимость</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured collections -->
  <section class="section" style="background: var(--silver-light);">
    <div class="container">
      <div class="section-title">
        <h2 data-i18n="featured_title">Коллекции</h2>
      </div>
      <div class="products-grid" id="featuredGrid"></div>
      <div style="text-align:center; margin-top: 40px;">
        <a href="catalog.html" class="btn btn--outline" data-i18n="hero_btn">Смотреть каталог</a>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section class="contact-block" id="contact">
    <div class="container">
      <h2 data-i18n="contact_title">Связаться с нами</h2>
      <div class="contact-buttons" id="contactButtons"></div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <span class="footer__brand">ETO GIOIELLI</span>
        <div class="footer__links">
          <a href="catalog.html" data-i18n="nav_catalog">Каталог</a>
          <a href="about.html" data-i18n="nav_about">О бренде</a>
        </div>
        <span class="footer__rights" data-i18n="footer_rights">© 2024 Eto Gioielli. Все права защищены.</span>
      </div>
    </div>
  </footer>

  <script src="js/config.js"></script>
  <script src="js/i18n.js"></script>
  <script src="data/products.js"></script>
  <script>
    // Header scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      header.classList.toggle('header--solid', window.scrollY > 60);
      header.classList.toggle('header--transparent', window.scrollY <= 60);
    });

    // Burger
    const burger = document.getElementById('burger');
    const mobileNav = document.getElementById('mobileNav');
    burger.addEventListener('click', () => mobileNav.classList.toggle('open'));

    // Featured products
    function formatPrice(p) { return p.toLocaleString('ru-RU') + ' ₽'; }
    function renderCard(product) {
      return `<a href="product.html?id=${product.id}" class="card">
        <div class="card__img"><img src="${product.images[0]}" alt="${product.name[getLang()]}" loading="lazy"></div>
        <div class="card__name">${product.name[getLang()]}</div>
        <div class="card__price">${formatPrice(product.price)}</div>
      </a>`;
    }
    const featured = window.PRODUCTS.filter(p => p.featured).slice(0, 6);
    document.getElementById('featuredGrid').innerHTML = featured.map(renderCard).join('');

    // Contact buttons
    document.getElementById('contactButtons').innerHTML = `
      <a href="https://wa.me/${CONFIG.contact.whatsapp.replace(/\D/g,'')}" class="btn btn--whatsapp" target="_blank" data-i18n="btn_whatsapp">WhatsApp</a>
      <a href="https://t.me/${CONFIG.contact.telegram.replace('@','')}" class="btn btn--telegram" target="_blank" data-i18n="btn_telegram">Telegram</a>
    `;
    applyTranslations(getLang());

    // Re-render on lang change (for card names)
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        featured.length && (document.getElementById('featuredGrid').innerHTML = featured.map(renderCard).join(''));
      });
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: Открыть в браузере, проверить**

```powershell
Start-Process "projects/eto-gioielli/index.html"
```

Ожидаем: шапка, hero-секция, 3 feature-блока, 6 featured карточек, кнопки WhatsApp/Telegram, футер. Переключатель RU/EN работает.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add index.html"
```

---

## Task 7: catalog.html + catalog.js

**Files:**
- Create: `projects/eto-gioielli/catalog.html`
- Create: `projects/eto-gioielli/js/catalog.js`

- [ ] **Step 1: Написать catalog.js**

`js/catalog.js`:
```js
(function () {
  let filtered = [];
  let currentPage = 1;
  const PER_PAGE = CONFIG.catalog.perPage;
  let activeCategory = 'all';
  let activeMetal = 'all';
  let maxPriceVal = 0;
  let caratMax = 0;

  function init() {
    // Compute max price and carat
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

  // Re-init on lang change
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      renderCategories();
      renderMetals();
      applyFilters();
    });
  });

  document.addEventListener('DOMContentLoaded', init);
})();
```

- [ ] **Step 2: Написать catalog.html**

`catalog.html`:
```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Каталог — Eto Gioielli</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <header class="header header--solid" id="header">
    <div class="container">
      <a href="index.html" class="header__logo">
        <img src="assets/logo.svg" alt="Eto Gioielli" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
        <span style="display:none">ETO GIOIELLI</span>
      </a>
      <nav class="nav">
        <a href="catalog.html" data-i18n="nav_catalog">Каталог</a>
        <a href="about.html" data-i18n="nav_about">О бренде</a>
        <a href="index.html#contact" data-i18n="nav_contact">Контакт</a>
        <div class="lang-switcher">
          <button class="lang-btn" data-lang="ru">RU</button>
          <button class="lang-btn" data-lang="en">EN</button>
        </div>
      </nav>
      <button class="burger" id="burger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <nav class="mobile-nav" id="mobileNav">
      <a href="catalog.html" data-i18n="nav_catalog">Каталог</a>
      <a href="about.html" data-i18n="nav_about">О бренде</a>
      <div class="lang-switcher">
        <button class="lang-btn" data-lang="ru">RU</button>
        <button class="lang-btn" data-lang="en">EN</button>
      </div>
    </nav>
  </header>

  <main style="padding-top: calc(var(--header-h) + 40px); padding-bottom: 80px;">
    <div class="container">

      <div class="catalog-header">
        <div>
          <h1 data-i18n="catalog_title">Каталог украшений</h1>
          <p class="catalog-count"><span id="itemsCount"></span></p>
        </div>
        <div class="search-bar">
          <span class="search-bar__icon">🔍</span>
          <input type="text" id="searchInput" data-i18n="search_placeholder" placeholder="Поиск...">
        </div>
      </div>

      <!-- Category tags -->
      <div class="filter-tags" id="categoryTags"></div>

      <!-- Filters row -->
      <div class="filters" style="margin-top: 16px;">
        <div class="filter-group">
          <label data-i18n="filter_price">Цена</label>
          <input type="range" id="priceSlider" min="0" value="1000000">
          <span class="filter-value" id="priceValue">—</span>
        </div>
        <div class="filter-group">
          <label data-i18n="filter_metal">Металл</label>
          <select id="metalSelect"></select>
        </div>
        <div class="filter-group">
          <label data-i18n="filter_carat">Карат</label>
          <input type="range" id="caratSlider" min="0" value="10">
          <span class="filter-value" id="caratValue">—</span>
        </div>
      </div>

      <!-- Grid -->
      <div class="products-grid" id="catalogGrid"></div>

      <!-- Pagination -->
      <div class="pagination" id="pagination"></div>
    </div>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <span class="footer__brand">ETO GIOIELLI</span>
        <span class="footer__rights" data-i18n="footer_rights">© 2024 Eto Gioielli.</span>
      </div>
    </div>
  </footer>

  <script src="js/config.js"></script>
  <script src="js/i18n.js"></script>
  <script src="data/products.js"></script>
  <script src="js/catalog.js"></script>
  <script>
    document.getElementById('burger').addEventListener('click', () =>
      document.getElementById('mobileNav').classList.toggle('open'));
  </script>
</body>
</html>
```

- [ ] **Step 3: Открыть в браузере, проверить**

```powershell
Start-Process "projects/eto-gioielli/catalog.html"
```

Ожидаем: заголовок, поиск, теги категорий, фильтры цены/металла/карата, сетка 4 колонки с карточками, пагинация. Фильтр по категории работает.

- [ ] **Step 4: Commit**

```bash
git add catalog.html js/catalog.js
git commit -m "feat: catalog page with filters and pagination"
```

---

## Task 8: product.html + product.js

**Files:**
- Create: `projects/eto-gioielli/product.html`
- Create: `projects/eto-gioielli/js/product.js`

- [ ] **Step 1: Написать product.js**

`js/product.js`:
```js
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

    // Gallery
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

    // Info
    document.getElementById('productArticle').textContent = product.specs.article;
    document.getElementById('productName').textContent = product.name[lang];
    document.getElementById('productPrice').textContent = formatPrice(product.price);
    document.getElementById('productDescription').textContent = product.description[lang];

    // Specs table
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

    // Contact buttons
    document.getElementById('productActions').innerHTML = `
      <a href="https://wa.me/${CONFIG.contact.whatsapp.replace(/\D/g,'')}" class="btn btn--whatsapp" target="_blank" data-i18n="btn_whatsapp">WhatsApp</a>
      <a href="https://t.me/${CONFIG.contact.telegram.replace('@','')}" class="btn btn--telegram" target="_blank" data-i18n="btn_telegram">Telegram</a>
    `;

    // Similar
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

  // Re-render on lang change
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', render);
  });
})();
```

- [ ] **Step 2: Написать product.html**

`product.html`:
```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Товар — Eto Gioielli</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <header class="header header--solid" id="header">
    <div class="container">
      <a href="index.html" class="header__logo">
        <img src="assets/logo.svg" alt="Eto Gioielli" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
        <span style="display:none">ETO GIOIELLI</span>
      </a>
      <nav class="nav">
        <a href="catalog.html" data-i18n="nav_catalog">Каталог</a>
        <a href="about.html" data-i18n="nav_about">О бренде</a>
        <a href="index.html#contact" data-i18n="nav_contact">Контакт</a>
        <div class="lang-switcher">
          <button class="lang-btn" data-lang="ru">RU</button>
          <button class="lang-btn" data-lang="en">EN</button>
        </div>
      </nav>
      <button class="burger" id="burger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <nav class="mobile-nav" id="mobileNav">
      <a href="catalog.html" data-i18n="nav_catalog">Каталог</a>
      <a href="about.html" data-i18n="nav_about">О бренде</a>
      <div class="lang-switcher">
        <button class="lang-btn" data-lang="ru">RU</button>
        <button class="lang-btn" data-lang="en">EN</button>
      </div>
    </nav>
  </header>

  <main id="productContent">
    <div class="container">
      <div class="product-layout">

        <!-- Gallery -->
        <div class="gallery">
          <div class="gallery__main">
            <img id="galleryMain" src="assets/placeholder.svg" alt="">
          </div>
          <div class="gallery__thumbs" id="galleryThumbs"></div>
        </div>

        <!-- Info -->
        <div class="product-info">
          <p class="product-article" id="productArticle"></p>
          <h1 id="productName"></h1>
          <p class="product-price" id="productPrice"></p>
          <table class="specs-table" id="specsTable"></table>
          <p class="product-description" id="productDescription"></p>
          <div class="product-actions" id="productActions"></div>
        </div>
      </div>
    </div>

    <!-- Similar -->
    <section class="similar" id="similarSection">
      <div class="container">
        <div class="section-title">
          <h2 data-i18n="similar_title">Похожие украшения</h2>
        </div>
        <div class="products-grid" id="similarGrid"></div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <span class="footer__brand">ETO GIOIELLI</span>
        <span class="footer__rights" data-i18n="footer_rights">© 2024 Eto Gioielli.</span>
      </div>
    </div>
  </footer>

  <script src="js/config.js"></script>
  <script src="js/i18n.js"></script>
  <script src="data/products.js"></script>
  <script src="js/product.js"></script>
  <script>
    document.getElementById('burger').addEventListener('click', () =>
      document.getElementById('mobileNav').classList.toggle('open'));
  </script>
</body>
</html>
```

- [ ] **Step 3: Открыть в браузере, проверить**

```powershell
Start-Process "projects/eto-gioielli/product.html?id=ring-001"
```

Ожидаем: галерея, название «Кольцо Aurora», цена, таблица характеристик, кнопки WhatsApp/Telegram, блок «Похожие украшения».

- [ ] **Step 4: Commit**

```bash
git add product.html js/product.js
git commit -m "feat: product page with gallery and similar items"
```

---

## Task 9: about.html

**Files:**
- Create: `projects/eto-gioielli/about.html`

- [ ] **Step 1: Написать about.html**

`about.html`:
```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>О бренде — Eto Gioielli</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <header class="header header--solid" id="header">
    <div class="container">
      <a href="index.html" class="header__logo">
        <img src="assets/logo.svg" alt="Eto Gioielli" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
        <span style="display:none">ETO GIOIELLI</span>
      </a>
      <nav class="nav">
        <a href="catalog.html" data-i18n="nav_catalog">Каталог</a>
        <a href="about.html" data-i18n="nav_about">О бренде</a>
        <a href="index.html#contact" data-i18n="nav_contact">Контакт</a>
        <div class="lang-switcher">
          <button class="lang-btn" data-lang="ru">RU</button>
          <button class="lang-btn" data-lang="en">EN</button>
        </div>
      </nav>
      <button class="burger" id="burger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <nav class="mobile-nav" id="mobileNav">
      <a href="catalog.html" data-i18n="nav_catalog">Каталог</a>
      <div class="lang-switcher">
        <button class="lang-btn" data-lang="ru">RU</button>
        <button class="lang-btn" data-lang="en">EN</button>
      </div>
    </nav>
  </header>

  <main>
    <section class="about-hero">
      <div class="container">
        <div class="about-content">
          <h1 data-i18n="about_page_title">О бренде</h1>
          <p>Eto Gioielli — ювелирный бренд, созданный с верой в то, что красота не должна стоить природе ничего. Мы создаём украшения из лабораторных бриллиантов — камней, идентичных природным по химическому составу, оптическим и физическим свойствам.</p>
          <p>Каждое украшение проходит строгий контроль качества и сопровождается сертификатом. Мы работаем с лучшими мастерами и используем только драгоценные металлы высшей пробы: белое и жёлтое золото 18K, платину 950.</p>
        </div>
      </div>
    </section>

    <section class="why-lab">
      <div class="container">
        <h2 data-i18n="about_lab_title">Почему лабораторные бриллианты?</h2>
        <div class="why-grid">
          <div class="why-item">
            <h3>🌿 Экология</h3>
            <p>Добыча природных бриллиантов наносит серьёзный ущерб экосистемам. Лабораторные бриллианты создаются с минимальным воздействием на природу.</p>
          </div>
          <div class="why-item">
            <h3>💎 Идентичное качество</h3>
            <p>Лабораторные бриллианты — не имитация. Это настоящие бриллианты, выращенные в контролируемых условиях. Они имеют те же физические и оптические свойства, что и природные.</p>
          </div>
          <div class="why-item">
            <h3>✦ Честная цена</h3>
            <p>Отсутствие посредников в цепочке добычи позволяет предложить украшения премиального качества по справедливой цене.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="contact-block">
      <div class="container">
        <h2 data-i18n="contact_title">Связаться с нами</h2>
        <div class="contact-buttons" id="contactButtons"></div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <span class="footer__brand">ETO GIOIELLI</span>
        <span class="footer__rights" data-i18n="footer_rights">© 2024 Eto Gioielli.</span>
      </div>
    </div>
  </footer>

  <script src="js/config.js"></script>
  <script src="js/i18n.js"></script>
  <script>
    document.getElementById('burger').addEventListener('click', () =>
      document.getElementById('mobileNav').classList.toggle('open'));
    document.getElementById('contactButtons').innerHTML = `
      <a href="https://wa.me/${CONFIG.contact.whatsapp.replace(/\D/g,'')}" class="btn btn--whatsapp" target="_blank" data-i18n="btn_whatsapp">WhatsApp</a>
      <a href="https://t.me/${CONFIG.contact.telegram.replace('@','')}" class="btn btn--telegram" target="_blank" data-i18n="btn_telegram">Telegram</a>
    `;
    applyTranslations(getLang());
  </script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add about.html
git commit -m "feat: about page"
```

---

## Task 10: README и финальная проверка

**Files:**
- Create: `projects/eto-gioielli/README.md`

- [ ] **Step 1: Создать README.md**

`README.md`:
```markdown
# Eto Gioielli

Сайт-каталог ювелирного бренда Eto Gioielli (украшения из лабораторных бриллиантов).

## Описание

Статический многостраничный сайт для отправки клиентам. Без e-commerce — клиент смотрит каталог и связывается через WhatsApp или Telegram.

## Возможности

- Каталог ~500 украшений с клиентской фильтрацией (категория, цена, металл, карат)
- Поиск по названию и артикулу
- Пагинация (24 товара на страницу)
- Страница товара: галерея, характеристики 4C, похожие товары
- Переключение RU/EN без перезагрузки
- Адаптивная верстка (мобильные устройства)

## Обновление каталога

Все товары в `data/products.js`. Формат одного товара:
```js
{ id, category, name: {ru, en}, description: {ru, en}, price, currency, images: [], specs: {metal, carat, cut, color, clarity, article}, featured }
```

## Контакты

Обновить в `js/config.js` → поле `CONFIG.contact`.
```

- [ ] **Step 2: Финальная проверка всех страниц**

Открыть поочерёдно:
1. `index.html` — переключить язык, кликнуть на карточку, проверить кнопки контакта
2. `catalog.html` — выбрать категорию «Кольца», проверить фильтр цены, поискать «Aurora»
3. `product.html?id=ring-001` — переключить язык, проверить что характеристики обновились
4. `about.html` — проверить отображение

- [ ] **Step 3: Финальный commit**

```bash
git add README.md
git commit -m "feat: complete Eto Gioielli catalog site v1.0"
```
