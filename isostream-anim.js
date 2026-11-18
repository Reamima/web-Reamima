/* REAMIMA · nube de puntos del IsoStream animada (la de AnimaIsoStream, en la app).
   Se aplica a cada <canvas class="rm-isostream">: la corona se rellena desde las 12 en sentido
   horario, se queda llena unos segundos, se apaga a puntos tenues y vuelve a empezar.
   Los puntos respiran siempre. Con «reducir movimiento» queda quieta y llena. */
(function () {
  'use strict';

  var canvases = document.querySelectorAll('canvas.rm-isostream');
  if (!canvases.length) return;

  // Tiempos (s): barrido, pausa con la nube llena, apagado y respiración
  var BARRIDO = 2.0, PAUSA = 4.0, APAGADO = 0.8, RESPIRACION = 7.8;
  var VUELTA = BARRIDO + PAUSA + APAGADO;

  // Medidas en fracción del lado (las de AnimaIsoStream)
  var RADIO_CIRCULO = 0.21, RADIO_INTERIOR = 0.23, RADIO_EXTERIOR = 0.47;
  var GROSOR_CIRCULO = 0.012, GROSOR_TRAZO = 0.022;
  var PUNTO_MIN = 0.006, PUNTO_MAX = 0.013, RESPIRA_MAX = 0.02;
  var FANTASMA = 0.15, VENTANA = 0.06, NUMERO_PUNTOS = 578;
  var TRAZO = [[-1, 0], [-0.529, 0], [-0.407, -0.193], [-0.25, 0.175],
               [-0.075, -0.818], [0.168, 0.75], [0.307, 0], [1, 0]];
  var AZUL = '#6B99E6', AMBAR = '#F28E39', MARINO = '#0E2483';
  // Tamaño del dibujo respecto al lado menor de la tarjeta: 1 = la nube casi ocupa el alto (diámetro 0,94)
  var ESCALA = 1.0;

  var reducirMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fraccion(x) { return x - Math.floor(x); }

  // Nube fija, sin generador aleatorio: secuencia R2 (la misma que la app)
  var nube = [];
  for (var i = 0; i < NUMERO_PUNTOS; i++) {
    nube.push({
      vuelta: fraccion(0.5 + i * 0.7548776662466927),
      hondo: Math.pow(fraccion(0.5 + i * 0.5698402909980532), 1.6),
      variacion: fraccion(i * 0.6180339887498948),
      fase: fraccion(i * 0.414213562373095),
      azul: i % 2 === 0
    });
  }

  /** Pinta un fotograma. t = segundos desde el inicio; con reducirMovimiento, nube llena y quieta. */
  function pintar(ctx, w, h, t) {
    var c = t % VUELTA;
    var barridos = reducirMovimiento ? 1 : Math.min(c / BARRIDO, 1);
    var encendido = (reducirMovimiento || c < BARRIDO + PAUSA) ? 1 : Math.max(0, 1 - (c - BARRIDO - PAUSA) / APAGADO);
    var reloj = reducirMovimiento ? 0 : t / RESPIRACION;
    var lado = Math.min(w, h) * ESCALA, cx = w / 2, cy = h / 2;

    ctx.clearRect(0, 0, w, h);
    for (var k = 0; k < nube.length; k++) {
      var p = nube[k];
      var aparicion = p.vuelta * (1 - VENTANA);
      var visible = Math.min(Math.max((barridos - aparicion) / VENTANA, 0), 1);
      var presencia = Math.max(visible * encendido, FANTASMA);
      var angulo = p.vuelta * 2 * Math.PI - Math.PI / 2;
      var radio = (RADIO_INTERIOR + p.hondo * (RADIO_EXTERIOR - RADIO_INTERIOR)) * lado;
      var giro = (reloj + p.fase) * 2 * Math.PI;
      var respira = RESPIRA_MAX * (0.4 + 0.6 * p.variacion) * lado;
      var x = cx + radio * Math.cos(angulo) + respira * Math.cos(giro);
      var y = cy + radio * Math.sin(angulo) + respira * Math.sin(giro);
      var r = (PUNTO_MIN + p.variacion * (PUNTO_MAX - PUNTO_MIN)) * lado * (0.4 + 0.6 * presencia);
      ctx.globalAlpha = (0.55 + 0.45 * p.variacion) * presencia;
      ctx.fillStyle = p.azul ? AZUL : AMBAR;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = MARINO;
    var rc = RADIO_CIRCULO * lado;
    ctx.lineWidth = GROSOR_CIRCULO * lado;
    ctx.beginPath(); ctx.arc(cx, cy, rc, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = GROSOR_TRAZO * lado; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    TRAZO.forEach(function (q, n) {
      var px = cx + q[0] * rc, py = cy + q[1] * rc;
      if (n === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
  }

  function iniciar(cv) {
    var ctx = cv.getContext('2d');
    if (!ctx) { console.error('❌ isostream-anim: el navegador no da contexto 2D; se queda la imagen estática.'); return; }
    var imagen = cv.parentNode.querySelector('img');
    var w = 0, h = 0, enPantalla = true, raf = 0, t0 = performance.now();

    function ajustar() {
      var caja = cv.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;
      w = caja.width; h = caja.height;
      cv.width = Math.max(1, Math.round(w * dpr)); cv.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function fotograma(ahora) {
      raf = 0;
      pintar(ctx, w, h, (ahora - t0) / 1000);
      if (enPantalla && !reducirMovimiento) raf = requestAnimationFrame(fotograma);
    }
    function arrancar() { if (!raf) raf = requestAnimationFrame(fotograma); }

    cv.hidden = false;           // el canvas sustituye a la imagen estática, que queda de respaldo sin JS
    if (imagen) imagen.style.display = 'none';
    ajustar();
    arrancar();
    if ('ResizeObserver' in window) new ResizeObserver(function () { ajustar(); arrancar(); }).observe(cv);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        enPantalla = entradas[0].isIntersecting;
        if (enPantalla) arrancar();
      }).observe(cv);
    }
  }

  canvases.forEach(iniciar);
})();
