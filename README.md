# Landing Page · Portfolio profesional

Sitio web estático en **HTML, CSS y JavaScript** para presentar servicios y proyectos de sistemas embebidos, IoT y automatización industrial, y recibir consultas de clientes.

> **Estado:** 🟢 v1.0 construida · Sitio bilingüe (ES/EN) con panel de edición visual incluido. Ver [`GUIA-SOCIOS.md`](./GUIA-SOCIOS.md) para editar y publicar sin programar.

---

## Índice

1. [Objetivo](#1-objetivo)
2. [Flujo de trabajo](#2-flujo-de-trabajo)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [Cómo completar y editar el contenido](#4-cómo-completar-y-editar-el-contenido)
5. [Cómo agregar un proyecto nuevo](#5-cómo-agregar-un-proyecto-nuevo)
6. [Guía para imágenes](#6-guía-para-imágenes)
7. [Probar en tu computadora](#7-probar-en-tu-computadora)
8. [Publicación](#8-publicación)
9. [Formulario de contacto](#9-formulario-de-contacto)
10. [Panel de edición visual (opcional)](#10-panel-de-edición-visual-opcional)
11. [Buenas prácticas y seguridad](#11-buenas-prácticas-y-seguridad)
12. [Mantenimiento](#12-mantenimiento)
13. [Hoja de ruta](#13-hoja-de-ruta)

---

## 1. Objetivo

- Generar **consultas y trabajos** a través de la web.
- Mostrar **proyectos reales** con problema, solución y resultado.
- Facilitar el contacto en un clic (WhatsApp, formulario, email).
- Mantener un sitio **rápido, liviano y fácil de actualizar**, sin depender de servidores propios.

## 2. Flujo de trabajo

```
1. Completar HARNESS.md   →   2. Construir la landing   →   3. Revisar en local
        ↓                                                           ↓
6. Mantener y mejorar    ←   5. Publicar (hosting)      ←   4. Subir a GitHub
```

| Paso | Qué se hace | Responsable |
|---|---|---|
| 1 | Completar el brief `HARNESS.md` (identidad, servicios, proyectos, contacto) | Vos |
| 2 | Generar `index.html`, estilos y scripts según el brief | Claude + vos |
| 3 | Revisar textos, fotos y comportamiento en celular | Vos |
| 4 | Subir el proyecto al repositorio de GitHub | Vos |
| 5 | Activar el hosting y el dominio | Vos |
| 6 | Agregar proyectos y mejorar con el tiempo | Vos |

## 3. Estructura del proyecto

```
mi-sitio/
├── index.html              # Página principal (única página)
├── admin.html              # Panel de edición visual (login → formularios, sin código)
├── README.md               # Este archivo
├── HARNESS.md              # Brief de diseño y contenido
├── GUIA-SOCIOS.md          # Guía paso a paso para editar/publicar sin programar
├── CNAME                   # (opcional) dominio propio
├── robots.txt              # Reglas para buscadores
├── sitemap.xml             # Mapa del sitio para Google
├── data/
│   └── content.js          # TODO el contenido del sitio (ES + EN) — lo edita el panel
├── css/
│   ├── variables.css       # Colores, tipografías, espaciados (se cambia el aspecto desde acá)
│   ├── estilos.css         # Estilos de las secciones
│   └── admin.css           # Estilos del panel de administración
├── js/
│   ├── render.js           # Motor: convierte el contenido en HTML
│   ├── i18n.js             # Selector de idioma ES/EN
│   ├── main.js             # Menú móvil, animaciones, modal y formulario
│   └── admin.js            # Lógica del panel de edición
├── img/
│   ├── logo.png
│   ├── perfil.jpg
│   ├── og-image.jpg        # Imagen al compartir en redes (1200×630)
│   ├── favicon.png
│   └── proyectos/
│       └── qisur-led.jpg
└── docs/
    └── cv.pdf              # (opcional) dossier descargable
```

**Regla simple:** los **textos y datos** están en `data/content.js` (se editan desde `admin.html`, sin tocar archivos), el **aspecto** en `css/` y las **fotos** en `img/`.

## 4. Cómo completar y editar el contenido

**Forma recomendada (sin código):** abrir `admin.html`, ingresar y editar todo desde los formularios. Ver la [sección 10](#10-panel-de-edición-visual-incluido).

**Forma manual:** todo el contenido está en `data/content.js`. Cada texto tiene su versión en español e inglés:

```js
subtitle: {
  es: "Integración tecnológica para la industria…",
  en: "Technology integration for industry…"
},
```

Buscá el texto con `Ctrl + F`, modificalo y guardá el archivo.

**Cambiar colores y fuentes:** abrir `css/variables.css` y modificar los valores:

```css
:root {
  --color-principal: #0a84ff;
  --color-acento:    #00d4aa;
  --color-fondo:     #0b0f14;
  --color-texto:     #e6edf3;
  --fuente-titulos:  "Inter", sans-serif;
}
```

## 5. Cómo agregar un proyecto nuevo

**Desde el panel (recomendado):** `admin.html` → pestaña **🚀 Proyectos** → botón **+ Agregar Proyecto** → completar → Guardar → Exportar → subir el `content.js` a GitHub.

No olvides subir también la foto del proyecto a `img/proyectos/` (sin espacios ni tildes en el nombre) y referenciarla en el campo **Imagen** (ej.: `img/proyectos/mi-proyecto.jpg`).

## 6. Guía para imágenes

| Tipo | Tamaño recomendado | Peso máximo | Formato |
|---|---|---|---|
| Fotos de proyectos | 1200 px de ancho | 300 KB | JPG / WebP |
| Foto de perfil | 800×800 px | 200 KB | JPG / WebP |
| Logo | Vectorial | 50 KB | SVG |
| Imagen para redes | 1200×630 px | 300 KB | JPG |
| Favicon | 512×512 px | 50 KB | PNG |

- Comprimí las imágenes con [squoosh.app](https://squoosh.app) antes de subirlas.
- Usá siempre el atributo `alt` (accesibilidad y SEO).
- **Revisá que no aparezcan datos sensibles** (nombres de clientes, IPs, claves, planos confidenciales).

## 7. Probar en tu computadora

**Opción simple:** abrir `index.html` con doble clic en el navegador.

**Opción recomendada** (simula un servidor real):

```bash
# Con Python (ya lo tenés instalado)
python -m http.server 8000
# Luego abrir: http://localhost:8000
```

También sirve la extensión **Live Server** de VS Code, que recarga la página al guardar.

## 8. Publicación

### Opción A · GitHub Pages (la más simple)

1. Crear un repositorio (por ejemplo `tu-usuario.github.io`).
2. Subir todos los archivos del proyecto.
3. Ir a **Settings → Pages** → elegir la rama `main` y la carpeta `/ (root)`.
4. En uno o dos minutos el sitio queda en `https://tu-usuario.github.io`.

### Opción B · Cloudflare Pages / Netlify

1. Conectar el repositorio de GitHub.
2. Sin comando de compilación; carpeta de publicación: `/`.
3. Cada `git push` publica la nueva versión automáticamente.

### Dominio propio

1. Comprar el dominio en un registrador (Namecheap, Cloudflare, etc.).
2. Configurar los registros DNS según las instrucciones del hosting elegido.
3. En GitHub Pages: crear el archivo `CNAME` con tu dominio y activar **Enforce HTTPS**.

### Subir cambios con Git

```bash
git add .
git commit -m "Agrego proyecto nuevo"
git push
```

## 9. Formulario de contacto

Al ser un sitio estático, el formulario necesita un servicio externo que reciba los datos y los envíe a tu correo:

| Servicio | Plan gratuito | Notas |
|---|---|---|
| Web3Forms | Sí | Muy simple, sin registro de servidor |
| Formspree | Sí (cantidad limitada) | Panel para ver los envíos |
| Netlify Forms | Sí (en Netlify) | Integrado al hosting |

Además, incluir siempre un **botón directo de WhatsApp**:

```html
<a href="https://wa.me/549XXXXXXXXXX?text=Hola%2C%20vi%20tu%20web%20y%20quiero%20consultar">
  Escribime por WhatsApp
</a>
```

*(Reemplazar `549XXXXXXXXXX` por tu número con código de país, sin `+` ni espacios.)*

## 10. Panel de edición visual (incluido)

El sitio ya trae un **panel de administración propio** en `admin.html` — no hace falta instalar ni pagar nada:

- Entrás con usuario y contraseña (por defecto `admin` / `admin2026`, **cambiarla al primer ingreso**).
- Editás todos los textos (ES y EN), servicios, proyectos, certificaciones y datos de contacto desde formularios.
- **💾 Guardar** aplica los cambios en tu navegador al instante (vista previa con **👁 Ver sitio**).
- **⬇ Exportar** descarga el archivo `content.js` para publicar los cambios en GitHub (3 clics, ver [`GUIA-SOCIOS.md`](./GUIA-SOCIOS.md)).

> Los cambios guardados en el panel se ven **solo en tu navegador** hasta que exportés y subas el `content.js` al repositorio.

En una etapa posterior se puede sumar **Decap CMS** (panel `/admin` que publica directo a GitHub sin exportar archivos). Como el contenido ya está separado del diseño en `data/content.js`, la migración no requiere rehacer la página.

## 11. Buenas prácticas y seguridad

- ❌ **Nunca subir** claves, tokens, contraseñas, datos de clientes ni código confidencial.
- ❌ No publicar planos, diagramas o capturas de sistemas de clientes sin autorización escrita.
- ✅ Revisar cada imagen antes de subirla (metadatos, IPs, nombres en pantallas).
- ✅ Mantener el repositorio ordenado y con mensajes de *commit* claros.
- ✅ Hacer una copia de seguridad local del proyecto.
- ✅ Probar los botones de contacto después de cada cambio importante.

## 12. Mantenimiento

| Frecuencia | Tarea |
|---|---|
| Cada proyecto nuevo | Agregarlo a la sección Proyectos con fotos y resultado |
| Mensual | Revisar que el formulario y WhatsApp funcionen; mirar analíticas |
| Trimestral | Actualizar servicios, experiencia y testimonios |
| Anual | Renovar dominio, revisar textos y SEO |

## 13. Hoja de ruta

- [x] **v0.1** · Completar `HARNESS.md`
- [x] **v1.0** · Landing lista: bilingüe ES/EN, servicios, proyectos, sobre mí, contacto + **panel de edición visual propio** (`admin.html`)
- [ ] **v1.1** · Dominio propio + analíticas + alta en Google Search Console
- [ ] **v1.2** · Testimonios y preguntas frecuentes
- [ ] **v2.0** · Decap CMS (publicar sin exportar archivos)
- [ ] **v2.1** · Versión en inglés como idioma principal
- [ ] **v3.0** · Páginas individuales por proyecto / blog técnico

---

## Contacto

| Canal | Dato |
|---|---|
| Responsable | [Tu nombre] |
| Email | [tu@email.com] |
| WhatsApp | [+__ _________] |
| Web | [https://tudominio.com] |
