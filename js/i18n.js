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