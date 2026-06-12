# LANKEU GOLD — Gold & Diamond Mining Project Website

Современный одностраничный сайт золото- и алмазодобывающего проекта в районе
**Бетаре-Ойя, Восточный регион, Республика Камерун** (~160 км от Бертуа).

Центр концессии: **5°32′35″ N, 14°05′11″ E** (5.54300, 14.08650).

## Что внутри

- `index.html` — главная страница (hero, проект, локация, фото, видео, контакты)
- `css/style.css` — тёмная «золотая» тема, анимации, адаптивная вёрстка
- `js/main.js` — карта (Leaflet + спутник Esri, полигон концессии), лайтбокс-галерея, счётчики, анимации
- `js/i18n.js` — переводы: **EN / FR / DE / RU** (переключатель в шапке)
- `assets/photos/` — фотографии (сейчас SVG-заглушки)
- `assets/videos/` — видеоролики

## Как добавить свои фото

1. Положите файл в `assets/photos/`, например `IMG_001.jpg`.
2. В `index.html` в секции `#gallery` замените у нужной `<figure>` путь:
   ```html
   <img src="assets/photos/IMG_001.jpg" alt="Описание">
   ```
3. Подпись меняется в `js/i18n.js` (ключи `gal.cap1`…`gal.cap6`) — на всех 4 языках.
   Можно добавлять новые `<figure>` по образцу — лайтбокс подхватит их автоматически.

## Как добавить видео

Положите файл в `assets/videos/` и замените заглушку в секции `#videos`:
```html
<div class="video__item">
  <video controls preload="metadata">
    <source src="assets/videos/drone.mp4" type="video/mp4">
  </video>
</div>
```
Либо вставьте YouTube-embed (`<iframe …>`).

## Запуск локально

Это статический сайт — достаточно открыть `index.html` в браузере, либо:
```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Для публикации подходит GitHub Pages, Netlify, Vercel — без сборки.
