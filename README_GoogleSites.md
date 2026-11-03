# REAMIMA · Traslado de la web a Google Sites

Esta carpeta (`web_claude/`) contiene la nueva web de **REAMIMA TECH, S.L.** lista para
publicarse. Está diseñada con el objetivo doble de:

1. Funcionar como sitio HTML autónomo si en el futuro se publica en un dominio propio.
2. Poder integrarse en **Google Sites** sin perder estructura ni estética, usando el
   bloque "Insertar → Insertar HTML" (también llamado "embed code").

Este documento explica cómo trasladar la web página por página, qué pegar en cada
bloque y qué limitaciones hay que tener en cuenta.

---

## 1. Inventario de páginas

| Archivo                          | Página de Google Sites          | Notas                                                      |
| -------------------------------- | ------------------------------- | ---------------------------------------------------------- |
| `inicio.html`                    | Inicio                          | Hero + tres pilares + Cardistream + Orígenes               |
| `sobre.html`                     | Sobre REAMIMA                   | Cuatro principios + capacidades                            |
| `origenes.html`                  | Orígenes                        | Hero, narrativa, Fig. 01, reconocimientos, vídeo, modelos  |
| `origenes-tratamiento-aire.html` | Orígenes / Tratamiento del aire | Sub-página · diagrama del subsistema de aire               |
| `origenes-simple.html`           | Orígenes / Modelo Simple        | Sub-página · diagrama Fig. 02 + cálculos + tiempos         |
| `origenes-avanzado.html`         | Orígenes / Modelo Avanzado      | Sub-página · diagrama Fig. 03 (en preparación)             |
| `contacta.html`                  | Contacta                        | Datos de contacto + carta abierta                          |
| `legal.html`                     | Legal                           | Aviso legal + privacidad + cookies (LSSI-CE / RGPD)        |

Hay además una hoja común:

- `_design-system.css` — sistema de diseño compartido por todas las páginas.

---

## 2. Cómo se inserta cada página en Google Sites

Google Sites permite insertar HTML mediante **Insertar → Insertar → HTML**. Hay dos
formas de hacerlo y ambas son compatibles con este sitio:

### Opción A · Embed por archivo completo (recomendada)

Subir cada `.html` a un servidor estable (por ejemplo Google Drive con permiso de
lectura, GitHub Pages, Netlify Drop o el propio dominio de REAMIMA) y embeder
mediante un `<iframe>` dentro de Google Sites.

1. Subir todos los archivos de `web_claude/` (incluyendo `_design-system.css`) al
   servidor elegido, manteniendo la misma estructura.
2. En Google Sites, en cada página, insertar un único bloque HTML con:

   ```html
   <iframe
     src="https://TU-DOMINIO/inicio.html"
     style="width:100%; height:100vh; border:0;"
     allowfullscreen
     loading="lazy"
   ></iframe>
   ```

3. Repetir cambiando `inicio.html` por la página correspondiente.

**Ventaja:** la web se ve exactamente como en la maqueta, con todas las animaciones
y la conmutación ES/EN funcionando.

**Inconveniente:** Google Sites añade su propia barra superior. Se puede minimizar
ocultando el banner con un encabezado tipo "minimal".

### Opción B · Pegar el HTML directamente en cada bloque "Embed code"

Google Sites limita cada bloque a aproximadamente **10 000 caracteres**. Para que
quepa, hay que:

1. Eliminar el bloque `<head>` y mover su contenido (incluido `<style>`) a un
   primer bloque insertado al inicio de la página.
2. Sustituir el `<link rel="stylesheet" href="_design-system.css">` por el
   contenido del CSS metido en un `<style>…</style>` dentro de ese mismo bloque
   inicial.
3. Pegar el cuerpo de la página (todo lo que está entre `<body>` y `</body>`) en
   uno o varios bloques HTML siguientes, respetando el orden.

Recomendamos esta opción solo si no se dispone de un servidor donde alojar los
archivos.

---

## 3. Bilingüe (ES / EN)

La conmutación entre español e inglés está hecha con un atributo en el `<body>`:

```html
<body data-active-lang="es">
```

Y dos botones en la barra de navegación:

```html
<button class="is-active" data-set-lang="es">ES</button>
<button data-set-lang="en">EN</button>
```

Cada elemento traducido se duplica:

```html
<span data-lang="es">Texto en español</span>
<span data-lang="en">Text in English</span>
```

Una regla CSS oculta el idioma inactivo. **Si Google Sites filtra el script** (no
debería, porque está dentro del propio bloque embed), simplemente borra los
fragmentos `<span data-lang="en">…</span>` para publicar la versión española.

---

## 4. Imágenes y medios

Esta nueva versión no embebe imágenes externas (lo que sí hacía la web original).
Todos los diagramas son **SVG en línea** y se ven correctamente en cualquier tamaño
de pantalla. Los vídeos siguen embebidos desde YouTube vía `<iframe>`.

Si en el futuro se quieren añadir fotografías:

- Subirlas a `/web_claude/img/` con nombres descriptivos en kebab-case.
- Usarlas con rutas relativas: `<img src="img/oshwa-seal.png" alt="…">`.

---

## 5. Datos pendientes de cumplimentar

Antes de publicar, revisar y completar **legal.html** sustituyendo los marcadores
`[pendiente de cumplimentar]` con:

- CIF / NIF de REAMIMA TECH, S.L.
- Domicilio social registral.
- Datos de inscripción en el Registro Mercantil (provincia, tomo, folio, hoja,
  inscripción).

El texto legal está redactado conforme a:

- **LSSI-CE 34/2002** (artículo 10 — datos identificativos).
- **RGPD UE 2016/679** y **LOPDGDD 3/2018** (política de privacidad).
- Mejores prácticas de aviso legal corporativo en España.

> Si el texto legal definitivo aprobado por asesoría es distinto, sustituir el
> contenido del bloque `<!-- CONTENIDO LEGAL -->` íntegro y mantener la
> tipografía mediante las clases `.legal-section`, `h2`, `h3`, etc.

---

## 6. Tipografías

El sitio usa dos tipografías de Google Fonts cargadas desde el propio CSS:

- **Inter** — para texto y encabezados.
- **IBM Plex Mono** — para etiquetas técnicas y código.

Las dos se cargan automáticamente vía `@import` al principio de
`_design-system.css`. Si Google Sites bloquea `@import`, copiar el `<link>`
equivalente al `<head>` de cada página (ya está incluido como fallback en el
fichero CSS).

---

## 7. Paleta de marca utilizada

| Color                     | Hex      | Uso                                  |
| ------------------------- | -------- | ------------------------------------ |
| Zafiro Oscuro REAMIMA     | #0E2483  | Color principal, titulares, líneas   |
| Tinta REAMIMA             | #050B2C  | Fondos profundos                     |
| Gris azulado claro        | #7C84B6  | Texto secundario, etiquetas técnicas |
| Acento ámbar discreto     | #C9A97A  | Acentos puntuales                    |
| Platino / paper           | #E6E6E6  | Fondos limpios                       |
| Stone (gris cálido)       | #F2F2EE  | Fondos alternos                      |
| Naranja pastel            | #FFDCC1  | Reservado para Cardistream           |

---

## 8. Comprobaciones antes de publicar

- [ ] CIF, domicilio y registro mercantil rellenados en `legal.html`.
- [ ] Cambiar el correo `proyectos@reamima.com` si no existe (en `contacta.html`).
- [ ] Revisar URL de la conferencia Arduino y vídeos en YouTube (en `origenes.html`).
- [ ] Probar la conmutación ES/EN en cada página.
- [ ] Validar que los diagramas SVG se ven nítidos en pantalla retina y móvil.
- [ ] Revisar el aviso legal con la asesoría jurídica habitual.

---

## 9. Mantenimiento futuro

Toda la web es estática y autoportante. Para hacer un cambio de copy global
(por ejemplo, modificar un eslogan), basta con buscar y reemplazar en los
ficheros HTML. Para cambiar un color de marca, editar la variable
correspondiente en `_design-system.css` (en el bloque `:root`).

Si se añade una nueva página, copiar la cabecera `<nav>` y el `<footer>` de
cualquier página existente para conservar la consistencia.
