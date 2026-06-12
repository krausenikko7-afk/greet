/* ============ LANKEU GOLD — interactions ============ */

/* ---------- language switcher ---------- */
let currentLang = localStorage.getItem('lang') || 'en';

function applyLang(lang) {
  const dict = I18N[lang] || I18N.en;
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) el.innerHTML = dict[key];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (dict[key]) el.placeholder = dict[key];
  });
  document.querySelectorAll('#langSwitch button').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang));

  if (window.__mapRefs) updateMapLang(dict);
}

document.querySelectorAll('#langSwitch button').forEach(btn =>
  btn.addEventListener('click', () => applyLang(btn.dataset.lang)));

/* ---------- nav: scrolled state + mobile burger ---------- */
const nav = document.getElementById('nav');
const navLinks = document.getElementById('navLinks');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 30));
document.getElementById('burger').addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ---------- reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- animated counters ---------- */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    counterObserver.unobserve(el);
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const dur = 1400, t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ---------- map (Leaflet, Esri satellite imagery) ---------- */
/* Official concession corner points (MINMIDT cadastre), ordered as boundary */
const CONCESSION = [
  [5.5446111, 14.0871528], // p1  NE
  [5.5443444, 14.0880667], // p2
  [5.5435556, 14.0876167], // p3
  [5.5428222, 14.0870583], // p6
  [5.5422611, 14.0862944], // p9
  [5.5417306, 14.0855167], // p13 SW
  [5.5422889, 14.0847472], // p14
  [5.5427417, 14.0854889], // p10
  [5.5432306, 14.0862278]  // p5
];
const CENTER = [5.54300, 14.08650];

const map = L.map('map', { scrollWheelZoom: false }).setView(CENTER, 15);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: 'Imagery © Esri, Maxar, Earthstar Geographics'
}).addTo(map);
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19
}).addTo(map);

const polygon = L.polygon(CONCESSION, {
  color: '#e6b34a', weight: 2.5, fillColor: '#e6b34a', fillOpacity: 0.18
}).addTo(map);

const marker = L.marker(CENTER).addTo(map);

window.__mapRefs = { polygon, marker };
function updateMapLang(dict) {
  marker.bindPopup(dict['loc.popup']);
  polygon.bindTooltip(dict['loc.polygon'], { sticky: true });
}

map.fitBounds(polygon.getBounds().pad(0.6));

/* ---------- lightbox gallery ---------- */
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('img');
const lbCaption = lightbox.querySelector('.lightbox__caption');
const items = [...document.querySelectorAll('.gallery__item')];
let lbIndex = 0;

function openLightbox(i) {
  lbIndex = (i + items.length) % items.length;
  const fig = items[lbIndex];
  lbImg.src = fig.querySelector('img').src;
  lbImg.alt = fig.querySelector('img').alt;
  lbCaption.textContent = fig.querySelector('figcaption').textContent;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

items.forEach((fig, i) => fig.addEventListener('click', () => openLightbox(i)));
lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox__prev').addEventListener('click', e => { e.stopPropagation(); openLightbox(lbIndex - 1); });
lightbox.querySelector('.lightbox__next').addEventListener('click', e => { e.stopPropagation(); openLightbox(lbIndex + 1); });
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') openLightbox(lbIndex - 1);
  if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
});

/* ---------- init ---------- */
applyLang(currentLang);
