# Eto Gioielli

Сайт-каталог ювелирного бренда Eto Gioielli (украшения из лабораторных бриллиантов).

## Описание

Статический многостраничный сайт для отправки клиентам. Без e-commerce — клиент смотрит каталог и связывается через WhatsApp или Telegram.

## Возможности

- Каталог украшений с клиентской фильтрацией (категория, цена, металл, карат)
- Поиск по названию и артикулу
- Пагинация (24 товара на страницу)
- Страница товара: галерея, характеристики 4C, похожие украшения
- Переключение RU/EN без перезагрузки
- Адаптивная верстка (мобильные устройства)

## Обновление каталога

Все товары в `data/products.js`. Формат одного товара:

```js
{
  id: "ring-001",
  category: "rings",   // rings | earrings | necklaces | bracelets | pendants | brooches | chains
  name: { ru: "...", en: "..." },
  description: { ru: "...", en: "..." },
  price: 45000,
  currency: "RUB",
  images: ["assets/images/ring-001-1.jpg"],
  specs: { metal: "wg18", carat: 0.5, cut: "Brilliant", color: "D", clarity: "VVS1", article: "EG-R-001" },
  featured: false
}
```

Металлы: `wg18` (белое золото 18K), `yg18` (жёлтое золото 18K), `pt950` (платина 950).

## Обновление контактов

`js/config.js` → поле `CONFIG.contact.whatsapp` и `CONFIG.contact.telegram`.

## Добавление фото

Скопировать в `assets/images/`. Имя файла прописать в поле `images` товара в `products.js`.
