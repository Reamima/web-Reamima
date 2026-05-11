# Últimas órdenes pendientes · REAMIMA web

> Lista de trabajo pendiente para retomar la web si se acaban los créditos.
> Marcar con `[x]` cada elemento al terminarlo.
> Última actualización: 26 de abril de 2026.

---

## ORDEN DE TRABAJO

Antes de tocar nada, **abrir y revisar `web_old/Education - Apple.webarchive`**
(página de Apple Education). Tomar nota de:

- Densidad de imágenes y composiciones por sección.
- Animaciones suaves de entrada (fade-up + parallax discreto).
- Uso de "tiles" / cards con foto a sangre que ocupan toda la columna.
- Escalado tipográfico fuerte: títulos enormes, párrafos cortos.
- Vacío respirado **con materia visual al lado**, nunca solo texto sobre blanco.

El objetivo: la web actual tiene aire pero está plana — debe ganar materia
gráfica sin perder serenidad.

---

## CHECKLIST DETALLADO

### A · Material gráfico que SÍ tenemos y hay que usar

`/06_Web/imagenes/Logos/`
- [ ] `1_Reamima_transpa.png` — logo principal sobre fondo claro
- [ ] `1_Reamima_transpa_Blanco.png` — logo blanco sobre fondo oscuro (usar en hero/footer ink)
- [ ] `Reamima_Tech_Minusculas.png` — variante con "tech" para barra superior

`/06_Web/imagenes/Marketing/` — composiciones generadas (Gemini), webp y jpg.
Incluye fondos abstractos azules, manos que sostienen pantallas, etc.

`/06_Web/imagenes/Situacion/`
- Personas corriendo, biking, pesas (Cardistream).
- Útil para la mención discreta de Cardistream en `inicio.html` y `sobre.html`.

`/06_Web/imagenes/isostream/`
- Renders del producto Isostream: `ISOSTREAM_Solido_transparente.png`,
  `ISOSTREAM_Mucho_transparente.png`. Útil para "uno de nuestros productos".

`/06_Web/imagenes/User Interface/`
- Gemini generated, nube de puntos, etc. Para fondo o textura.

`outputs/old_images/` (extraídas del webarchive de la web original)
- `origenes_01_845886af.jpg` — sello / portada
- `origenes_02_e76c29aa.jpg` — diagrama bomba+depósitos canónico
- `origenes_03_b8426e0c.jpg` — mismo diagrama con 700 ml
- `tratamiento_del_aire_01_dc6a3378.jpg` — enfermera con Ambu
- `tratamiento_del_aire_03_63f9f75d.png` — calentador acuario
- `tratamiento_del_aire_04_95c335e1.png` — lámpara UV
- `tratamiento_del_aire_02_b1f03e5c.jpg` — bomba de aire pecera
- `simple_03_0de88539.jpg` — bomba Waldbeck
- `simple_04_7590301e.jpg` — placa relés Omron

**Acción**: copiar a `/web_claude/img/` y referenciar como `<img src="img/...">`.

### B · Correcciones de hero y composición global

- [ ] **inicio.html** — "Magia por fuera" se pisa con el texto siguiente.
      Ajustar `line-height` del título o añadir `margin-bottom` al título del hero
      Y dar más aire entre `or-hero__title` y `rm-lead`.
- [ ] **inicio.html** — quitar el botón hacia Orígenes que está en la zona del hero
      (ya está en la nav superior). Conservar la nav.
- [ ] **Logo en cada página** — añadir `<img src="img/reamima-logo.png">` en la
      barra `rm-nav__brand` en lugar del texto `REAMIMA`. Dos versiones:
      logo color sobre fondo claro, logo blanco sobre fondo ink.
- [ ] **Logo grande en footer** — añadir versión grande en `rm-foot`.

### C · Material gráfico nuevo en cada página

- [ ] **inicio.html** — añadir 3 imágenes hero rotadas:
      hero principal con foto/render abstracto al lado del título,
      "tile" Cardistream con `Bici_Cardistream_ok.jpeg` o `Pesas_Cardistream.png`,
      "tile" Origenes con render del respirador (de old_images).
      Disposición tipo Apple Education: tarjetas con foto a sangre arriba,
      título grande debajo, lectura corta.
- [ ] **sobre.html** — añadir un retrato/foto técnica + bloque con
      `ISOSTREAM_Solido_transparente.png` como ejemplo de proyecto.
- [ ] **origenes.html** — añadir `tratamiento_del_aire_01_dc6a3378.jpg`
      (enfermera con Ambu) en el hero de "el mundo se detuvo".
      Incluir también el sello OSHWA real si está descargable;
      si no, mantener la "OS" estilizada que ya hay.
- [ ] **origenes-tratamiento-aire.html** — añadir las 3 fotos reales:
      bomba pecera, calentador, lámpara UV, en una tira lateral o pie de figura.
- [ ] **origenes-simple.html** — añadir foto de la bomba Waldbeck
      y la placa de relés Omron, debajo de los apartados correspondientes.

### D · Correcciones de los SVG técnicos

#### D1. Fig. 01 (origenes.html) · Bomba de agua entre dos depósitos
- [ ] Quitar el fondo inferior de la botella invertida — es por donde entra el agua.
- [ ] La parte superior de la botella es la SALIDA del aire (es el cuello hacia
      arriba). Las flechas de aire deben salir desde la TAPA SUPERIOR (cuello),
      no desde dentro del cuerpo.
- [ ] Resolver solapamiento de etiquetas "Aire", "Bomba de agua", "Depósito ...".
      Probablemente subir el bloque del título "Aire" más arriba y mover
      "Bomba de agua" a un lado.

#### D2. Fig. tratamiento del aire (origenes-tratamiento-aire.html)
- [ ] Aumentar tamaño de letra de las etiquetas (al menos 13–14 px).
- [ ] **Lámpara UV ha de estar en el AIRE, no en el agua.** Reposicionarla
      por encima del nivel de agua (en la cámara de aire, en lo alto del depósito).
- [ ] Mantener bomba de aire (que ya estaba bien).

#### D3. Fig. 02 (origenes-simple.html) · Modelo Simple
- [ ] La botella invertida NO debe tener tapa inferior — debe ser abierta abajo.
- [ ] La flecha superior de la boca de la botella es DE SALIDA (aire al exterior),
      no de entrada. Ajustar dirección y etiqueta.
- [ ] Aumentar todas las letras (mínimo 13 px). Resolver TODOS los solapamientos.
- [ ] Las líneas de los relés a las bombas se cruzan y no llegan a las bombas.
      Rediseñar el ruteado: R1 → Bomba 1 (línea limpia, sin cruces),
      R2 → Bomba 2 (línea limpia).
- [ ] Las señales "Mando 1+/-/-" no deben atravesar las cajas de los relés.
      Ponerlas a la izquierda como bornes externos al relé.
- [ ] Enchufe 220V debe alimentar AMBOS relés mediante una línea de bus que
      NO atraviese los relés.
- [ ] La tubería de Bomba 1 (sumergida en Depósito Inspiración) debe
      INTRODUCIRSE dentro del Depósito de Agua (no quedarse encima),
      llegando bajo la superficie del agua.
- [ ] La tubería de Bomba 2 debe ir desde el Depósito de Agua hasta el
      Depósito de Inspiración SIN cruzarse con la otra y SIN atravesar nada.
      Llegar bajo la superficie del agua del depósito de inspiración.

#### D4. Fig. 03 (origenes-avanzado.html) · Modelo Avanzado
- [ ] Aumentar tamaño de letra (al menos 13 px en cuerpos, 16 en títulos).
- [ ] El controlador en lazo cerrado tiene 3 líneas; debe tener solo 2:
      una a la caja de SENSORES y otra a la caja de MODELO SIMPLE.
      Borrar la tercera (la que va al bloque "Mascarilla + expiración asistida").

### E · Página Modelo Avanzado · contenido

- [ ] Eliminar COMPLETAMENTE el bloque CTA "Si trabajas en hospital… colabora
      en la siguiente iteración". El proyecto está parado. Sustituir por un
      bloque sobrio que diga simplemente: "Línea de I+D parada en 2021. La
      documentación queda publicada como referencia."

### F · Animaciones / vida (estilo Apple Education)

- [ ] Añadir IntersectionObserver para fade-up al hacer scroll en cada
      `.rm-section` y en cada `.rec`, `.modelo`, `.feat`. Stagger por hijo.
- [ ] Parallax suave (translate Y -10 a +10 px) en imágenes hero por scroll.
- [ ] Botones con micro-transiciones más generosas (300–400 ms ease).
- [ ] Hover en cards con elevación + ligeramente más fuerte (sombra más larga).

### G · Verificación final tras cambios

- [ ] Renderizar cada página y comprobar visualmente solapamientos.
- [ ] Comprobar logo en nav y footer.
- [ ] Comprobar imágenes en cada sección.
- [ ] Comprobar SVG corregidos en Chrome y Safari.
- [ ] Conmutación ES/EN sigue funcionando con los nuevos elementos.

---

## ESTADO ACTUAL DEL TRABAJO

Ya hechas (sesión 1):
- Sistema de diseño base, paleta, tipografías Inter + IBM Plex Mono.
- Páginas: inicio, sobre, origenes, origenes-tratamiento-aire,
  origenes-simple, origenes-avanzado, contacta, legal.
- README_GoogleSites.md.
- Ocho páginas servidas con HTTP 200, ES/EN equilibrado.

Por hacer (sesión 2 — esta lista):
- Todas las correcciones A–G arriba.
