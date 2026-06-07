# Eto Gioielli — Дизайн-спецификация

**Дата:** 2026-06-06  
**Проект:** `projects/eto-gioielli`  
**Тип:** Статический каталог-сайт (без e-commerce)

---

## 1. О проекте

Сайт-каталог ювелирного бренда **Eto Gioielli** (украшения из лабораторных бриллиантов). Назначение — отправлять клиентам ссылку для просмотра ассортимента. Продажи на сайте не ведутся: клиент связывается через WhatsApp или Telegram.

---

## 2. Архитектура

**Тип:** Multi-page static site  
**Данные:** `data/products.js` — JS-массив ~500 товаров  
**Фильтрация:** Клиентская (JS), без сервера  
**Язык:** RU + EN, переключатель в шапке (без перезагрузки страницы)

### Структура файлов

```
projects/eto-gioielli/
├── index.html
├── catalog.html
├── product.html
├── about.html
├── data/
│   └── products.js
├── assets/
│   ├── logo.svg
│   ├── images/
│   └── placeholder.jpg
├── css/
│   └── style.css
└── js/
    ├── catalog.js
    ├── product.js
    └── i18n.js
```

---

## 3. Страницы

### index.html — Главная
1. Hero: логотип крупно, слоган RU/EN, кнопка "Смотреть каталог"
2. О бренде: 2-3 строки + 3 преимущества (экология / качество / цена)
3. Featured коллекции: сетка 3×2 (товары с `featured: true`)
4. Контакт: кнопки WhatsApp + Telegram

### catalog.html — Каталог
1. Заголовок + счётчик ("124 украшения")
2. Фильтры: категория (теги) + цена (ползунок) + металл + карат + поиск
3. Сетка: 4 колонки desktop / 2 мобайл, 24 товара на страницу
4. Пагинация

### product.html — Товар
Параметр URL: `?id=ring-001`
1. Галерея: главное фото + миниатюры
2. Название, артикул, цена
3. Характеристики: металл, карат, огранка, цвет, чистота
4. Описание (RU/EN)
5. Кнопки: WhatsApp + Telegram
6. Похожие товары (та же категория, 4 карточки)

### about.html — О бренде
1. История Eto Gioielli
2. Почему лабораторные бриллианты
3. Контакты

---

## 4. Данные товара

```js
{
  id: "ring-001",
  category: "rings",        // rings | earrings | necklaces | bracelets | pendants | brooches | chains
  name: { ru: "...", en: "..." },
  description: { ru: "...", en: "..." },
  price: 45000,
  currency: "RUB",
  images: ["assets/images/ring-001-1.jpg"],
  specs: {
    metal: "Белое золото 18K",
    carat: 0.5,
    cut: "Brilliant",
    color: "D",
    clarity: "VVS1",
    article: "EG-R-001"
  },
  featured: false
}
```

---

## 5. Визуальный стиль

| Роль | Цвет |
|---|---|
| Фон | `#FFFFFF` |
| Основной текст | `#1A1A2E` |
| Акцент / кнопки | `#1E3A8A` |
| Серебро / детали | `#C0C0C0` / `#E8E8E8` |
| Hover | `#2563EB` |

**Шрифты:**
- Заголовки: `Cormorant Garamond` (Google Fonts)
- Текст: `Inter` (Google Fonts)

**UI-детали:**
- Кнопки: border-radius 2px (строгий, премиальный)
- Карточка товара: фото + название + цена, hover — увеличение
- Шапка: фиксированная, прозрачная на главной / белая на остальных

---

## 6. Логотип и фото

- Логотип: файл `assets/logo.svg` (предоставит владелец)
- Фото товаров: `assets/images/{id}-{n}.jpg` (предоставит владелец)
- До загрузки реальных фото: `assets/placeholder.jpg`

---

## 7. Контакт

Кнопки на каждой странице товара и на главной:
- WhatsApp: `https://wa.me/{phone}`
- Telegram: `https://t.me/{username}`

Номер и username — **глобальные константы** в `js/config.js`:
```js
const CONTACT = { whatsapp: "+79001234567", telegram: "@etogioielli" }
```
Один файл для обновления на весь сайт.
