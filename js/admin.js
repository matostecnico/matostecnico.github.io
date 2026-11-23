/* ============================================================
   PANEL DE ADMINISTRACIÓN
   Editor visual del contenido del sitio.
   - Guarda los cambios en el navegador (localStorage)
   - "Exportar" descarga content.js listo para publicar
   ============================================================ */

/* ---------- Estado ---------- */
let DATA = null;
let dirty = false;
let tabActual = "perfil";
let imgTargetPath = null;

function cargarDatos() {
  try {
    const editado = localStorage.getItem("siteContent");
    if (editado) return JSON.parse(editado);
  } catch (e) { /* usar original */ }
  return JSON.parse(JSON.stringify(window.SITE_CONTENT));
}

/* ---------- Acceso por ruta ("hero.title.es") ---------- */
function getPath(obj, path) { return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj); }
function setPath(obj, path, val) {
  const ks = path.split(".");
  const last = ks.pop();
  ks.reduce((o, k) => o[k], obj)[last] = val;
}
/* Huella simple de la contraseña (barrera visual, no seguridad criptográfica) */
function hashPass(s) {
  let h = 5381;
  for (const ch of String(s)) h = ((h << 5) + h + ch.codePointAt(0)) >>> 0;
  return String(h);
}
function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ---------- Definición de secciones y campos ---------- */
const TIPOS_SERVICIO_ICONO = ["plc", "iot", "software", "chip", "integracion", "soporte"];

const SCHEMA = [
  {
    id: "perfil", titulo: "👤 Perfil", ayuda: "Tu nombre, rol y datos principales que aparecen en toda la web.",
    campos: [
      { path: "profile.brand", type: "text", label: "Marca / wordmark (junto al logo)", ayuda: "Ej.: Angel.dev — lo que se ve arriba a la izquierda en la web" },
      { path: "profile.name", type: "text", label: "Nombre completo" },
      { path: "profile.role", type: "i18n", label: "Rol / título profesional" },
      { path: "profile.slogan", type: "i18n", label: "Eslogan" },
      { path: "profile.photo", type: "image", label: "Foto de perfil", ayuda: "Cargá la imagen (se sube sola) o poné una ruta (img/perfil.jpg)" },
      { path: "profile.logo", type: "image", label: "Logo", ayuda: "Cargá el logo (se sube solo) o poné una ruta (img/logo.png)" },
      { path: "profile.heroImage", type: "image", label: "Imagen animada de la portada", ayuda: "Se muestra a la derecha del inicio" },
      { path: "profile.location", type: "i18n", label: "Ubicación" },
      { path: "theme.fondo", type: "color", label: "Color de fondo", ayuda: "Fondo general de la web" },
      { path: "theme.principal", type: "color", label: "Color primario" },
      { path: "theme.acento", type: "color", label: "Color secundario" }
    ]
  },
  {
    id: "hero", titulo: "🏠 Portada", ayuda: "Lo primero que se ve al entrar a la página.",
    campos: [
      { path: "hero.backgroundImage", type: "image", label: "Imagen de fondo", ayuda: "Se muestra semitransparente detrás de la portada" },
      { path: "hero.title", type: "i18nArea", label: "Titular principal", rows: 2 },
      { path: "hero.titleHighlight", type: "i18n", label: "Parte resaltada (texto exacto dentro del titular)", ayuda: "Debe coincidir exactamente con una parte del titular para mostrarse con el degradado de color." },
      { path: "hero.subtitle", type: "i18nArea", label: "Subtítulo", rows: 2 },
      { path: "hero.primaryCta.label", type: "i18n", label: "Texto del botón principal (WhatsApp)" },
      { path: "hero.secondaryCta.label", type: "i18n", label: "Texto del botón secundario (LinkedIn)" },
      { path: "hero.badges", type: "listI18n", label: "Datos de confianza (3 recomendados)", nombreItem: "Dato" }
    ]
  },
  {
    id: "sobre", titulo: "🙋 Sobre mí", ayuda: "Tu presentación, formación, experiencia laboral y certificaciones.",
    campos: [
      { path: "about.bio", type: "i18nArea", label: "Presentación (3–5 líneas)" },
      { path: "about.personal", type: "i18nArea", label: "Dato personal / diferencial", rows: 3 },
      { path: "about.years", type: "number", label: "Años de experiencia" },
      { path: "about.education", type: "listI18n", label: "Formación", nombreItem: "Título" },
      { path: "about.certifications", type: "listObj", label: "Certificaciones", nombreItem: "Certificación", itemLabel: "name",
        campos: [
          { key: "name", type: "i18n", label: "Nombre del certificado" },
          { key: "issuer", type: "text", label: "Institución" },
          { key: "image", type: "image", label: "Imagen del certificado", ayuda: "Cargá el escaneo de tu certificado (se sube solo)" }
        ] },
      { path: "about.experience", type: "listObj", label: "Experiencia laboral", nombreItem: "Experiencia", itemLabel: "role",
        campos: [
          { key: "period", type: "text", label: "Período", ayuda: "Ej.: 2021 — 2024" },
          { key: "role", type: "i18n", label: "Cargo" },
          { key: "company", type: "i18n", label: "Empresa / lugar" },
          { key: "description", type: "i18nArea", label: "Descripción", rows: 2 }
        ] },
      { path: "about.industries", type: "listI18n", label: "Industrias donde trabajaste", nombreItem: "Industria" },
      { path: "about.languages", type: "listI18n", label: "Idiomas", nombreItem: "Idioma" }
    ]
  },
  {
    id: "servicios", titulo: "⚙️ Servicios", ayuda: "Entre 4 y 6 servicios. Cada uno dice qué incluye y qué recibe el cliente.",
    campos: [
      { path: "services", type: "listObj", label: "Servicios", nombreItem: "Servicio", itemLabel: "title",
        campos: [
          { key: "icon", type: "select", label: "Ícono", options: TIPOS_SERVICIO_ICONO },
          { key: "title", type: "i18n", label: "Nombre del servicio" },
          { key: "description", type: "i18nArea", label: "Descripción (1–2 frases)", rows: 2 },
          { key: "deliverable", type: "i18nArea", label: "Qué recibe el cliente", rows: 2 },
          { key: "tech", type: "listPlain", label: "Tecnologías", nombreItem: "Tecnología" }
        ] }
    ]
  },
  {
    id: "proceso", titulo: "🧭 Cómo trabajo", ayuda: "Los pasos de tu proceso de trabajo, para dar previsibilidad al cliente.",
    campos: [
      { path: "process", type: "listObj", label: "Pasos del proceso", nombreItem: "Paso", itemLabel: "title",
        campos: [
          { key: "title", type: "i18n", label: "Título del paso" },
          { key: "description", type: "i18nArea", label: "Descripción corta", rows: 2 }
        ] }
    ]
  },
  {
    id: "proyectos", titulo: "🚀 Proyectos", ayuda: "La sección que más convence. Cada proyecto cuenta: problema → solución → resultado.",
    campos: [
      { path: "projects", type: "listObj", label: "Proyectos", nombreItem: "Proyecto", itemLabel: "title",
        campos: [
          { key: "title", type: "i18n", label: "Título del proyecto" },
          { key: "sector", type: "i18n", label: "Sector / tipo de cliente" },
          { key: "year", type: "text", label: "Año" },
          { key: "client", type: "text", label: "Cliente (dejá vacío si es anónimo)" },
          { key: "problem", type: "i18nArea", label: "Problema (situación inicial)" },
          { key: "solution", type: "i18nArea", label: "Solución (qué hiciste)" },
          { key: "result", type: "i18nArea", label: "Resultado (con números si es posible)" },
          { key: "tech", type: "listPlain", label: "Tecnologías usadas", nombreItem: "Tecnología" },
          { key: "image", type: "image", label: "Imagen del proyecto", ayuda: "Cargá la foto o captura (se sube sola)" },
          { key: "link", type: "text", label: "Enlace externo (opcional)" }
        ] }
    ]
  },
  {
    id: "contacto", titulo: "📞 Contacto", ayuda: "Tus canales de contacto y el formulario.",
    campos: [
      { path: "contact.whatsapp", type: "text", label: "WhatsApp (solo números, con código de país)", ayuda: "Ej.: 541123989145 — sin +, espacios ni guiones." },
      { path: "contact.whatsappMessage", type: "i18nArea", label: "Mensaje precargado de WhatsApp", rows: 2 },
      { path: "contact.email", type: "text", label: "Email (vacío = no se muestra)" },
      { path: "contact.linkedin", type: "text", label: "LinkedIn (URL completa; vacío = no se muestra)", ayuda: "Ej.: https://www.linkedin.com/in/tu-usuario" },
      { path: "contact.github", type: "text", label: "GitHub (URL completa; vacío = no se muestra)" },
      { path: "contact.availability", type: "i18n", label: "Tiempo de respuesta prometido" },
      { path: "contact.web3formsKey", type: "text", label: "Clave de Web3Forms (para el formulario)",
        ayuda: "Pedila gratis en https://web3forms.com con tu email. Mientras esté vacía, el formulario deriva las consultas a tu WhatsApp." },
      { path: "contact.formServices", type: "listI18n", label: "Opciones del desplegable «Tipo de servicio»", nombreItem: "Opción" },
      { path: "contact.confirmation", type: "i18nArea", label: "Mensaje de confirmación al enviar", rows: 2 }
    ]
  },
  {
    id: "seo", titulo: "🔍 SEO y ajustes", ayuda: "Cómo aparece tu web en Google y al compartirla en redes.",
    campos: [
      { path: "meta.title", type: "i18n", label: "Título de la página (máx. 60 caracteres)" },
      { path: "meta.description", type: "i18nArea", label: "Descripción para buscadores (máx. 155 caracteres)", rows: 2 },
      { path: "meta.keywords", type: "text", label: "Palabras clave (separadas por coma)" },
      { path: "meta.ogImage", type: "text", label: "Imagen para redes (ruta)", ayuda: "Recomendado: 1200×630 px — Ej.: img/og-image.jpg" },
      { path: "settings.defaultLang", type: "select", label: "Idioma por defecto", options: ["es", "en"] }
    ]
  }
];

/* ============================================================
   GENERADORES DE HTML DE CAMPOS
   ============================================================ */

function campoTexto(path, label, ayuda) {
  return `<div class="fila"><label>${esc(label)}</label>
    <input type="text" data-path="${path}" value="${esc(getPath(DATA, path))}">
    ${ayuda ? `<small style="color:var(--color-texto-suave)">${esc(ayuda)}</small>` : ""}</div>`;
}

function campoNumero(path, label) {
  return `<div class="fila"><label>${esc(label)}</label>
    <input type="number" min="0" data-path="${path}" value="${esc(getPath(DATA, path))}"></div>`;
}

function campoSelect(path, label, options) {
  const actual = getPath(DATA, path);
  return `<div class="fila"><label>${esc(label)}</label>
    <select data-path="${path}">${options.map(o => `<option value="${esc(o)}"${o === actual ? " selected" : ""}>${esc(o)}</option>`).join("")}</select></div>`;
}

/* Selector de color (fondo / primario / secundario) */
function campoColor(path, label, ayuda) {
  const val = getPath(DATA, path) || "#000000";
  return `<div class="fila"><label>${esc(label)}</label>
    <div class="color-fila">
      <input type="color" class="color-picker" data-colorpath="${path}" value="${esc(val)}">
      <input type="text" data-path="${path}" value="${esc(val)}" spellcheck="false">
    </div>
    ${ayuda ? `<small style="color:var(--color-texto-suave)">${esc(ayuda)}</small>` : ""}</div>`;
}

/* Imagen con "Cargar imagen" (sube el archivo y lo guarda automáticamente) */
function campoImagen(path, label, ayuda) {
  const val = getPath(DATA, path) || "";
  const previa = val
    ? `<img class="img-previa" src="${esc(val)}" alt="">`
    : `<div class="img-previa img-previa--vacia">sin imagen</div>`;
  return `<div class="fila"><label>${esc(label)}</label>
    <div class="img-fila">
      ${previa}
      <div class="img-acciones">
        <input type="text" data-path="${path}" value="${esc(val)}" placeholder="img/ruta.jpg o imagen cargada" spellcheck="false">
        <button type="button" class="mini-btn mini-btn--subir" data-action="cargar-img" data-path="${path}">⬆ Cargar imagen</button>
      </div>
    </div>
    ${ayuda ? `<small style="color:var(--color-texto-suave)">${esc(ayuda)}</small>` : ""}</div>`;
}

/* Convierte un archivo de imagen a data URL, redimensionado para que pese poco */
function archivoADataURL(file, listo) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1200;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        const s = Math.min(MAX / w, MAX / h);
        w = Math.round(w * s); h = Math.round(h * s);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      // PNG conserva transparencia (logos/fondos); el resto se comprime a JPEG
      const esPNG = file.type === "image/png" || file.type === "image/svg+xml";
      listo(esPNG ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

/* Campo traducible { es, en }: dos entradas lado a lado */
function campoI18n(path, label, area, rows) {
  const tag = area
    ? p => `<textarea rows="${rows || 4}" data-path="${path}.${p}">${esc(getPath(DATA, path + "." + p))}</textarea>`
    : p => `<input type="text" data-path="${path}.${p}" value="${esc(getPath(DATA, path + "." + p))}">`;
  return `<div class="fila"><label>${esc(label)}</label>
    <div class="i18n">
      <div class="idioma" data-lang="ES">${tag("es")}</div>
      <div class="idioma" data-lang="EN">${tag("en")}</div>
    </div></div>`;
}

/* Lista de textos simples: ["Python", "MQTT"] */
function listaPlana(path, label, nombreItem) {
  const items = getPath(DATA, path) || [];
  return `<div class="fila"><label>${esc(label)}</label>
    <div class="lista" data-lista="${path}">
      ${items.map((it, i) => `
        <div class="item-simple">
          <input type="text" data-path="${path}.${i}" value="${esc(it)}">
          <button type="button" class="mini-btn mini-btn--orden" data-action="mover" data-dir="-1" data-path="${path}" data-index="${i}" title="Subir">↑</button>
          <button type="button" class="mini-btn mini-btn--orden" data-action="mover" data-dir="1" data-path="${path}" data-index="${i}" title="Bajar">↓</button>
          <button type="button" class="mini-btn" data-action="quitar" data-path="${path}" data-index="${i}" title="Quitar">✕</button>
        </div>`).join("")}
      <button type="button" class="btn-agregar" data-action="agregar-plano" data-path="${path}">+ Agregar ${esc(nombreItem || "ítem")}</button>
    </div></div>`;
}

/* Lista de textos traducibles: [{es, en}] */
function listaI18n(path, label, nombreItem) {
  const items = getPath(DATA, path) || [];
  return `<div class="fila"><label>${esc(label)}</label>
    <div class="lista" data-lista="${path}">
      ${items.map((it, i) => `
        <div class="lista__item item-simple">
          <div class="i18n">
            <div class="idioma" data-lang="ES"><input type="text" data-path="${path}.${i}.es" value="${esc(it.es)}"></div>
            <div class="idioma" data-lang="EN"><input type="text" data-path="${path}.${i}.en" value="${esc(it.en)}"></div>
          </div>
          <div class="orden-btns">
            <button type="button" class="mini-btn mini-btn--orden" data-action="mover" data-dir="-1" data-path="${path}" data-index="${i}" title="Subir">↑</button>
            <button type="button" class="mini-btn mini-btn--orden" data-action="mover" data-dir="1" data-path="${path}" data-index="${i}" title="Bajar">↓</button>
            <button type="button" class="mini-btn" data-action="quitar" data-path="${path}" data-index="${i}" title="Quitar">✕</button>
          </div>
        </div>`).join("")}
      <button type="button" class="btn-agregar" data-action="agregar-i18n" data-path="${path}">+ Agregar ${esc(nombreItem || "ítem")}</button>
    </div></div>`;
}

/* Lista de objetos con sub-campos (servicios, proyectos, etc.) */
function listaObj(path, label, campos, nombreItem, itemLabel) {
  const items = getPath(DATA, path) || [];
  const tituloItem = (it, i) => {
    const v = itemLabel ? it[itemLabel] : null;
    const txt = v && typeof v === "object" ? (v.es || v.en) : v;
    return `#${i + 1}${txt ? " · " + txt : ""}`;
  };
  return `<div class="fila"><label>${esc(label)}</label>
    <div class="lista" data-lista="${path}">
      ${items.map((it, i) => `
        <div class="lista__item">
          <div class="cab">
            <strong>${esc(tituloItem(it, i))}</strong>
            <div class="orden-btns">
              <button type="button" class="mini-btn mini-btn--orden" data-action="mover" data-dir="-1" data-path="${path}" data-index="${i}" title="Subir">↑</button>
              <button type="button" class="mini-btn mini-btn--orden" data-action="mover" data-dir="1" data-path="${path}" data-index="${i}" title="Bajar">↓</button>
              <button type="button" class="mini-btn" data-action="quitar" data-path="${path}" data-index="${i}">✕ Quitar</button>
            </div>
          </div>
          ${campos.map(c => subCampo(`${path}.${i}.${c.key}`, c)).join("")}
        </div>`).join("")}
      <button type="button" class="btn-agregar" data-action="agregar-obj" data-path="${path}">+ Agregar ${esc(nombreItem || "ítem")}</button>
    </div></div>`;
}

function subCampo(path, c) {
  switch (c.type) {
    case "text": return campoTexto(path, c.label, c.ayuda);
    case "number": return campoNumero(path, c.label);
    case "select": return campoSelect(path, c.label, c.options);
    case "color": return campoColor(path, c.label, c.ayuda);
    case "image": return campoImagen(path, c.label, c.ayuda);
    case "i18n": return campoI18n(path, c.label, false);
    case "i18nArea": return campoI18n(path, c.label, true, c.rows);
    case "listPlain": return listaPlana(path, c.label, c.nombreItem);
    case "listI18n": return listaI18n(path, c.label, c.nombreItem);
    default: return "";
  }
}

function renderCampo(c) {
  switch (c.type) {
    case "text": return campoTexto(c.path, c.label, c.ayuda);
    case "number": return campoNumero(c.path, c.label);
    case "select": return campoSelect(c.path, c.label, c.options);
    case "color": return campoColor(c.path, c.label, c.ayuda);
    case "image": return campoImagen(c.path, c.label, c.ayuda);
    case "i18n": return campoI18n(c.path, c.label, false);
    case "i18nArea": return campoI18n(c.path, c.label, true, c.rows);
    case "listPlain": return listaPlana(c.path, c.label, c.nombreItem);
    case "listI18n": return listaI18n(c.path, c.label, c.nombreItem);
    case "listObj": return listaObj(c.path, c.label, c.campos, c.nombreItem, c.itemLabel);
    default: return "";
  }
}

/* ============================================================
   RENDER DEL PANEL
   ============================================================ */

function renderTabs() {
  document.getElementById("tabs").innerHTML =
    SCHEMA.map(s => `<button type="button" data-tab="${s.id}" class="${s.id === tabActual ? "activo" : ""}">${esc(s.titulo)}</button>`).join("") +
    `<p class="nota">💾 «Guardar» aplica los cambios en este navegador.<br><br>⬇ «Exportar» descarga el archivo para publicar los cambios en internet.</p>`;
}

function renderForm() {
  const sec = SCHEMA.find(s => s.id === tabActual);
  let html = `<h2>${esc(sec.titulo)}</h2><p class="ayuda">${esc(sec.ayuda)}</p>`;
  if (sec.id === "contacto") html += `<div class="aviso">⚠ Los cambios se ven al instante en <strong>este navegador</strong> después de «Guardar». Para que los vea todo el mundo: «Exportar» y subir el archivo a tu repositorio (ver GUIA-SOCIOS.md, paso 3).</div>`;
  html += sec.campos.map(renderCampo).join('<hr class="hr">');
  document.getElementById("formPanel").innerHTML = html;
}

function renderTodo() {
  document.getElementById("marcaNombre").textContent = " · " + (DATA.profile.brand || DATA.profile.name || "");
  if (DATA.profile.logo) document.querySelectorAll("#panelLogo, #loginLogo").forEach(i => i.src = DATA.profile.logo);
  renderTabs();
  renderForm();
}

/* ---------- Indicador de cambios ---------- */
function marcarDirty() {
  dirty = true;
  const el = document.getElementById("sinGuardar");
  el.textContent = "● Cambios sin guardar";
  el.style.color = "#fbbf24";
  el.classList.add("visible");
}
function marcarGuardado(txt) {
  dirty = false;
  const el = document.getElementById("sinGuardar");
  el.textContent = txt || "✔ Guardado";
  el.style.color = "#34d399";
  el.classList.add("visible");
  setTimeout(() => { if (!dirty) el.classList.remove("visible"); }, 2500);
}

/* ---------- Objeto nuevo para listas ---------- */
function objetoVacio(campos) {
  const o = {};
  campos.forEach(c => {
    if (c.type === "i18n" || c.type === "i18nArea") o[c.key] = { es: "", en: "" };
    else if (c.type === "listPlain") o[c.key] = [];
    else o[c.key] = "";
  });
  return o;
}

/* ============================================================
   ACCIONES
   ============================================================ */

function guardar() {
  localStorage.setItem("siteContent", JSON.stringify(DATA));
  marcarGuardado("✔ Guardado en este navegador");
}

function exportar() {
  const contenido =
`/* ============================================================
   CONTENIDO DEL SITIO
   Generado desde el panel de administración (${new Date().toLocaleString("es-AR")})
   ============================================================ */

window.SITE_CONTENT = ${JSON.stringify(DATA, null, 2)};
`;
  const blob = new Blob([contenido], { type: "text/javascript;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "content.js";
  a.click();
  URL.revokeObjectURL(a.href);
  marcarGuardado("✔ Archivo content.js descargado");
}

/* Extrae el objeto de contenido de un archivo content.js (o JSON) */
function parsearContenido(txt) {
  const marca = txt.indexOf("SITE_CONTENT");
  if (marca > -1) {
    const eq = txt.indexOf("=", marca);
    if (eq > -1) txt = txt.slice(eq + 1);
  }
  return JSON.parse(txt.replace(/;\s*$/, "").trim());
}

function importar(archivo) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const datos = parsearContenido(reader.result);
      if (!datos.profile || !Array.isArray(datos.services)) throw new Error("estructura inválida");
      DATA = datos;
      guardar();
      renderTodo();
      alert("✅ Contenido importado correctamente.");
    } catch (e) {
      alert("❌ El archivo no es válido. Usá un content.js exportado desde este panel.");
    }
  };
  reader.readAsText(archivo);
}

function cambiarClave() {
  const actual = prompt("Contraseña actual:");
  if (actual === null) return;
  if (hashPass(actual) !== String(DATA.settings.adminPass)) { alert("❌ Contraseña incorrecta."); return; }
  const nueva = prompt("Nueva contraseña (mínimo 6 caracteres):");
  if (nueva === null) return;
  if (nueva.length < 6) { alert("❌ Muy corta: mínimo 6 caracteres."); return; }
  DATA.settings.adminPass = hashPass(nueva);
  guardar();
  alert("✅ Contraseña actualizada. Anotala en un lugar seguro.");
}

/* ============================================================
   LOGIN
   ============================================================ */

function initLogin() {
  const loginDiv = document.getElementById("login");
  const panel = document.getElementById("panel");

  const entrar = () => {
    loginDiv.style.display = "none";
    panel.classList.add("activo");
    renderTodo();
  };

  if (sessionStorage.getItem("siteAdmin") === "1") { entrar(); return; }

  document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value;
    if (user === DATA.settings.adminUser && hashPass(pass) === String(DATA.settings.adminPass)) {
      sessionStorage.setItem("siteAdmin", "1");
      entrar();
    } else {
      document.getElementById("loginError").textContent = "Usuario o contraseña incorrectos";
    }
  });
}

/* ============================================================
   EVENTOS
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  DATA = cargarDatos();
  initLogin();

  /* Cambios en cualquier campo (input y change: cubre <select> en todos los navegadores) */
  const aplicarCambio = e => {
    // Selector de color: guarda y sincroniza el campo hex
    if (e.target.classList.contains("color-picker")) {
      const p = e.target.dataset.colorpath;
      setPath(DATA, p, e.target.value);
      const txt = document.querySelector(`input[data-path="${p}"]`);
      if (txt) txt.value = e.target.value;
      marcarDirty();
      return;
    }
    const path = e.target.dataset.path;
    if (!path) return;
    setPath(DATA, path, e.target.type === "number" ? Number(e.target.value) : e.target.value);
    // Si es un campo de color escrito a mano, sincroniza el picker
    const picker = document.querySelector(`input[data-colorpath="${path}"]`);
    if (picker && /^#[0-9a-fA-F]{3,6}$/.test(e.target.value)) picker.value = e.target.value;
    marcarDirty();
  };
  document.getElementById("formPanel").addEventListener("input", aplicarCambio);
  document.getElementById("formPanel").addEventListener("change", aplicarCambio);

  /* Botones de listas (agregar / quitar / mover) + cargar imagen */
  document.getElementById("formPanel").addEventListener("click", e => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const path = btn.dataset.path;

    // Cargar imagen (campo escalar, no es lista)
    if (btn.dataset.action === "cargar-img") {
      imgTargetPath = path;
      document.getElementById("imgFile").click();
      return;
    }

    const lista = getPath(DATA, path);
    if (!Array.isArray(lista)) return;

    if (btn.dataset.action === "quitar") {
      lista.splice(Number(btn.dataset.index), 1);
    } else if (btn.dataset.action === "mover") {
      const i = Number(btn.dataset.index), j = i + Number(btn.dataset.dir);
      if (j >= 0 && j < lista.length) { const t = lista[i]; lista[i] = lista[j]; lista[j] = t; }
    } else if (btn.dataset.action === "agregar-plano") {
      lista.push("");
    } else if (btn.dataset.action === "agregar-i18n") {
      lista.push({ es: "", en: "" });
    } else if (btn.dataset.action === "agregar-obj") {
      const sec = SCHEMA.find(s => s.id === tabActual);
      const def = sec.campos.find(c => c.path === path && c.type === "listObj");
      lista.push(def ? objetoVacio(def.campos) : { es: "", en: "" });
    }
    marcarDirty();
    renderForm();
  });

  /* Imagen: al elegir un archivo se redimensiona y se guarda automáticamente */
  document.getElementById("imgFile").addEventListener("change", e => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file || !imgTargetPath) return;
    archivoADataURL(file, dataURL => {
      setPath(DATA, imgTargetPath, dataURL);
      marcarDirty();
      renderForm();
    });
  });

  /* Pestañas */
  document.getElementById("tabs").addEventListener("click", e => {
    const btn = e.target.closest("[data-tab]");
    if (!btn) return;
    tabActual = btn.dataset.tab;
    renderTabs();
    renderForm();
  });

  /* Barra superior */
  document.getElementById("btnGuardar").addEventListener("click", guardar);
  document.getElementById("btnExportar").addEventListener("click", exportar);
  document.getElementById("btnImportar").addEventListener("click", () => document.getElementById("importFile").click());
  document.getElementById("importFile").addEventListener("change", e => { if (e.target.files[0]) importar(e.target.files[0]); e.target.value = ""; });
  document.getElementById("btnClave").addEventListener("click", cambiarClave);
  document.getElementById("btnVer").addEventListener("click", () => { guardar(); window.open("index.html", "_blank"); });
  document.getElementById("btnReset").addEventListener("click", () => {
    if (!confirm("⚠ Esto descarta TODOS los cambios hechos en el panel y vuelve al contenido original del archivo. ¿Seguro?")) return;
    localStorage.removeItem("siteContent");
    DATA = cargarDatos();
    renderTodo();
    marcarGuardado("↺ Contenido restablecido");
  });
  document.getElementById("btnSalir").addEventListener("click", () => {
    if (dirty && !confirm("Hay cambios sin guardar. ¿Salir igual?")) return;
    sessionStorage.removeItem("siteAdmin");
    location.reload();
  });

  /* Aviso al cerrar con cambios sin guardar */
  window.addEventListener("beforeunload", e => { if (dirty) e.preventDefault(); });
});
