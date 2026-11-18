/* REAMIMA · multiidioma.
   es y en viven en el HTML (span[data-lang]). El resto de idiomas se carga desde
   i18n/<código>.json: clave = texto en español (sin etiquetas, espacios colapsados),
   valor = HTML traducido. Prioridad: ?lang= > elección guardada > navegador > es. */
(function () {
  'use strict';

  var LANGS = [
    ['es', 'Español'], ['en', 'English'], ['de', 'Deutsch'], ['fr', 'Français'],
    ['it', 'Italiano'], ['pt', 'Português'], ['es-419', 'Español (LatAm)'],
    ['ja', '日本語'], ['ko', '한국어'], ['zh-Hans', '简体中文'], ['zh-Hant', '繁體中文']
  ];
  var CODES = LANGS.map(function (l) { return l[0]; });
  var STORE_KEY = 'rm-lang';
  var ATTRS = ['aria-label', 'alt', 'placeholder'];
  var cache = {};
  var originals = new Map(); // elemento → {atributo: valor original en español}
  var originalTitle = '';
  var originalDescription = '';

  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }

  function fromQuery() {
    var m = /[?&]lang=([^&#]+)/.exec(location.search);
    return m && CODES.indexOf(decodeURIComponent(m[1])) > -1 ? decodeURIComponent(m[1]) : null;
  }
  function fromStore() {
    try {
      var v = localStorage.getItem(STORE_KEY);
      return v && CODES.indexOf(v) > -1 ? v : null;
    } catch (e) { return null; }
  }
  function mapBrowserTag(tag) {
    var p = String(tag).toLowerCase().split('-');
    var base = p[0];
    if (base === 'zh') {
      var region = p[p.length - 1];
      return (p.indexOf('hant') > -1 || region === 'tw' || region === 'hk' || region === 'mo') ? 'zh-Hant' : 'zh-Hans';
    }
    if (base === 'es') return (p.length === 1 || p[1] === 'es') ? 'es' : 'es-419';
    return CODES.indexOf(base) > -1 ? base : null;
  }
  function fromBrowser() {
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'es'];
    for (var i = 0; i < list.length; i++) {
      var c = mapBrowserTag(list[i]);
      if (c) return c;
    }
    return 'es';
  }
  function pickLang() { return fromQuery() || fromStore() || fromBrowser(); }

  var current = pickLang();
  var root = document.documentElement;
  root.setAttribute('lang', current);
  // Oculta la página hasta tener la traducción (evita el parpadeo del español); tope de 2 s.
  if (current !== 'es' && current !== 'en') {
    root.classList.add('i18n-pending');
    setTimeout(function () { root.classList.remove('i18n-pending'); }, 2000);
  }

  function loadDict(code) {
    if (cache[code]) return cache[code];
    cache[code] = fetch('i18n/' + code + '.json').then(function (r) {
      if (!r.ok) throw new Error('i18n/' + code + '.json → HTTP ' + r.status);
      return r.json();
    });
    return cache[code];
  }

  function removeGenerated() {
    document.querySelectorAll('[data-i18n-gen]').forEach(function (n) { n.remove(); });
  }

  function translateText(dict, code) {
    document.querySelectorAll('[data-lang="es"]').forEach(function (el) {
      if (el.closest('[data-i18n-skip]')) return;
      var en = el.nextElementSibling;
      if (en && en.getAttribute('data-lang') !== 'en') en = null;
      var val = dict[norm(el.textContent)];
      // Sin traducción: es-419 cae al español; el resto, al inglés
      if (val === undefined) val = (en && code !== 'es-419') ? en.innerHTML : el.innerHTML;
      var clone = el.cloneNode(false);
      clone.setAttribute('data-lang', 'tr');
      clone.setAttribute('data-i18n-gen', '');
      clone.innerHTML = val;
      el.parentNode.insertBefore(clone, el.nextSibling);
    });
  }

  function collectOriginals() {
    if (originals.size || originalTitle) return;
    originalTitle = document.title;
    var meta = document.querySelector('meta[name="description"]');
    originalDescription = meta ? meta.getAttribute('content') : '';
    ATTRS.forEach(function (a) {
      document.querySelectorAll('[' + a + ']').forEach(function (el) {
        if (el.closest('.rm-lang')) return; // el selector se gestiona aparte
        var o = originals.get(el) || {};
        o[a] = el.getAttribute(a);
        originals.set(el, o);
      });
    });
  }

  function applyAttrs(dict, fallbackDict) {
    function tr(es) {
      var k = norm(es);
      if (dict && dict[k] !== undefined) return dict[k];
      if (fallbackDict && fallbackDict[k] !== undefined) return fallbackDict[k];
      return es;
    }
    document.title = tr(originalTitle);
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', tr(originalDescription));
    originals.forEach(function (o, el) {
      Object.keys(o).forEach(function (a) { el.setAttribute(a, tr(o[a])); });
    });
    var sel = document.querySelector('.rm-lang select');
    if (sel) sel.setAttribute('aria-label', tr('Idioma'));
  }

  function apply(code) {
    current = code;
    root.setAttribute('lang', code);
    document.body.setAttribute('data-active-lang', code);
    var sel = document.querySelector('.rm-lang select');
    if (sel) sel.value = code;
    removeGenerated();
    collectOriginals();
    if (code === 'es') { applyAttrs(null, null); root.classList.remove('i18n-pending'); return Promise.resolve(); }
    var jobs = [loadDict('en')];
    if (code !== 'en') jobs.push(loadDict(code));
    return Promise.all(jobs).then(function (res) {
      if (current !== code) return; // el usuario cambió de idioma mientras cargaba
      var en = res[0], dict = res[1];
      if (code === 'en') { applyAttrs(en, null); }
      else { translateText(dict, code); applyAttrs(dict, code === 'es-419' ? null : en); }
      root.classList.remove('i18n-pending');
    }).catch(function (err) {
      console.error('❌ i18n: no se pudo cargar el idioma «' + code + '»; se muestra el inglés.', err);
      document.body.setAttribute('data-active-lang', 'en');
      root.setAttribute('lang', 'en');
      root.classList.remove('i18n-pending');
    });
  }

  function buildSelector() {
    var box = document.querySelector('.rm-lang');
    if (!box) return;
    var sel = document.createElement('select');
    sel.setAttribute('aria-label', 'Idioma');
    LANGS.forEach(function (l) {
      var o = document.createElement('option');
      o.value = l[0]; o.textContent = l[1]; o.setAttribute('lang', l[0]);
      sel.appendChild(o);
    });
    box.textContent = '';
    box.appendChild(sel);
    sel.addEventListener('change', function () {
      try { localStorage.setItem(STORE_KEY, sel.value); } catch (e) { /* sin almacenamiento: la elección vale solo en esta página */ }
      if (fromQuery()) history.replaceState(null, '', location.pathname + location.hash);
      apply(sel.value);
    });
  }

  function start() { buildSelector(); apply(current); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
