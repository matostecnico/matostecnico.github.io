/* ============================================================
   MOTOR DE RENDERIZADO
   Lee el contenido (data/content.js o lo editado en el panel
   admin) y construye el HTML de cada sección.
   ============================================================ */

window.Site = {
  lang: null,
  content: null,

  /* Carga el contenido: primero lo editado en el panel admin
     (localStorage), si no, el archivo data/content.js */
  loadContent() {
    try {
      const editado = localStorage.getItem("siteContent");
      if (editado) return JSON.parse(editado);
    } catch (e) { /* contenido corrupto: usar el original */ }
    return window.SITE_CONTENT;
  },

  /* Idioma activo: guardado > navegador > defecto */
  loadLang() {
    const guardado = localStorage.getItem("siteLang");
    if (guardado) return guardado;
    const nav = (navigator.language || "").slice(0, 2).toLowerCase();
    if (nav === "es" || nav === "en") return nav;
    return (this.content.settings && this.content.settings.defaultLang) || "es";
  },

  /* Traducción de un campo { es, en } o texto plano */
  t(campo) {
    if (campo == null) return "";
    if (typeof campo === "object" && !Array.isArray(campo)) return campo[this.lang] ?? campo.es ?? "";
    return campo;
  },

  init() {
    this.content = this.loadContent();
    this.lang = this.loadLang();
    this.renderAll();
  },

  renderAll() {
    renderTheme();
    renderMeta();
    renderNav();
    renderHero();
    renderAbout();
    renderServices();
    renderProcess();
    renderProjects();
    renderContact();
    renderFooter();
    renderFloaters();
    document.documentElement.lang = this.lang;
    if (typeof window.SiteAfterRender === "function") window.SiteAfterRender();
  }
};

/* ---------- Iconos SVG ---------- */
const ICONS = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  cert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/></svg>',
  plc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h4M7 14h2M15 10h2M15 14h2M8 3v3M16 3v3M8 18v3M16 18v3"/></svg>',
  iot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12a10 10 0 0 1 14 0M8.5 15.5a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="19" r="1.4" fill="currentColor"/><path d="M2 9a15 15 0 0 1 20 0"/></svg>',
  software: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6l-6 6 6 6M16 6l6 6-6 6M13 4l-2 16"/></svg>',
  chip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><rect x="10" y="10" width="4" height="4"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>',
  integracion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4"/><circle cx="12" cy="12" r="3"/></svg>',
  soporte: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4.5 4.5 0 0 0-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 0 0 6-6L14 13l-3-3 3.7-3.7z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.2-.8l.5-.6c.1-.2.1-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.1 2.1-.2 3.7a11.6 11.6 0 0 0 4.5 4.3c1.7.8 2.4.9 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.1-.5-.2z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.4 20.4h-3.5v-5.5c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.6H9.4V9h3.4v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.2 2.4 4.2 5.4v6.3zM5.3 7.4a2 2 0 1 1 0-4.1 2 2 0 0 1 0 4.1zM7.1 20.4H3.6V9h3.5v11.4z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.3-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
};

function icon(nombre) { return ICONS[nombre] || ICONS.chip; }

/* ---------- Utilidades ---------- */
function esc(txt) {
  return String(txt ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* Devuelve una ruta usable para <img>; si es inválida (ej. ruta de Windows)
   usa un placeholder para que no se rompa la imagen */
function imgSrc(val, fallback) {
  const v = String(val || "");
  if (v.startsWith("img/") || v.startsWith("data:") || v.startsWith("http") || v.startsWith("./") || v.startsWith("/")) return v;
  return fallback || "img/certificados/cert-1.png";
}

function waUrl() {
  const c = Site.content.contact;
  return "https://wa.me/" + c.whatsapp + "?text=" + encodeURIComponent(Site.t(c.whatsappMessage));
}

/* ---------- Render por sección ---------- */

function renderMeta() {
  const m = Site.content.meta;
  document.title = Site.t(m.title);
  setMeta("description", Site.t(m.description));
  setMeta("keywords", m.keywords);
  setMetaProp("og:title", Site.t(m.title));
  setMetaProp("og:description", Site.t(m.description));
  setMetaProp("og:image", m.ogImage);
}
function setMeta(name, val) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
  el.content = val;
}
function setMetaProp(prop, val) {
  let el = document.querySelector(`meta[property="${prop}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute("property", prop); document.head.appendChild(el); }
  el.content = val;
}

function renderNav() {
  const c = Site.content, ui = c.ui.nav;
  const links = [
    ["sobre-mi", ui.about], ["servicios", ui.services], ["proceso", ui.process],
    ["proyectos", ui.projects], ["contacto", ui.contact]
  ];
  document.getElementById("navMenu").innerHTML = links
    .map(([id, txt]) => `<li><a class="nav__link" href="#${id}" data-seccion="${id}">${esc(Site.t(txt))}</a></li>`)
    .join("");
  document.getElementById("navLogo").innerHTML =
    `<img src="${esc(c.profile.logo)}" alt="Logo ${esc(c.profile.name)}">
     <span>${esc(c.profile.brand || (c.profile.name.split(" ")[0] + ".dev")).replace(/\./, "<em>.</em>")}</span>`;
  document.querySelectorAll(".lang-toggle button").forEach(b =>
    b.classList.toggle("activo", b.dataset.lang === Site.lang));
}

/* Aplica la paleta de colores elegida (editable desde el panel) */
function hexA(hex, alpha) {
  const h = (hex || "").replace("#", "");
  const v = h.length === 3 ? h.split("").map(x => x + x).join("") : h;
  const n = parseInt(v, 16);
  if (isNaN(n)) return `rgba(230,0,255,${alpha})`;
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}
function renderTheme() {
  const t = Site.content.theme;
  if (!t) return;
  const r = document.documentElement.style;
  if (t.fondo) r.setProperty("--color-fondo", t.fondo);
  if (t.principal) {
    r.setProperty("--color-principal", t.principal);
    r.setProperty("--glow-principal", `0 0 24px ${hexA(t.principal, .35)}`);
  }
  if (t.acento) {
    r.setProperty("--color-acento", t.acento);
    r.setProperty("--glow-acento", `0 0 24px ${hexA(t.acento, .35)}`);
  }
}

function renderHero() {
  const c = Site.content, h = c.hero;
  const titulo = Site.t(h.title), res = Site.t(h.titleHighlight);
  const tituloHtml = res && titulo.includes(res)
    ? esc(titulo).split(esc(res)).join(`<span class="resaltado">${esc(res)}</span>`)
    : esc(titulo);

  const ctaSec = c.contact.linkedin
    ? `<a class="btn btn--secundario" href="${esc(c.contact.linkedin)}" target="_blank" rel="noopener">${icon("linkedin")}${esc(Site.t(h.secondaryCta.label))}</a>`
    : "";

  document.getElementById("heroInner").innerHTML = `
    <div class="hero__grid">
      <div class="hero__texto">
        <span class="hero__saludo reveal">&lt;/&gt; ${esc(Site.t(c.profile.slogan))}</span>
        <h1 class="hero__titulo reveal" data-delay="1">${tituloHtml}</h1>
        <p class="hero__rol reveal" data-delay="2"><span id="typed"></span><span class="caret">|</span></p>
        <p class="hero__subtitulo reveal" data-delay="3">${esc(Site.t(h.subtitle))}</p>
        <div class="hero__ctas reveal" data-delay="4">
          <a class="btn btn--principal" href="${waUrl()}" target="_blank" rel="noopener">${icon("whatsapp")}${esc(Site.t(h.primaryCta.label))}</a>
          ${ctaSec}
        </div>
        <ul class="hero__badges reveal" data-delay="5">
          ${h.badges.map(b => `<li>${icon("check")}${esc(Site.t(b))}</li>`).join("")}
        </ul>
      </div>
      <div class="hero__imagen reveal" data-delay="2">
        <div class="hero__marco">
          <img src="${esc(c.profile.heroImage)}" alt="${esc(c.profile.name)}">
        </div>
      </div>
    </div>`;
  const fondo = document.getElementById("heroFondoImg");
  if (fondo) fondo.style.backgroundImage = c.hero.backgroundImage ? `url("${esc(c.hero.backgroundImage)}")` : "";
}

function renderAbout() {
  const c = Site.content, a = c.about, L = Site.content.ui.labels;

  document.getElementById("sobreMiInner").innerHTML = `
    <div class="sobre__grid">
      <div class="sobre__foto reveal">
        <div class="marco"><img src="${esc(c.profile.photo)}" alt="${esc(c.profile.name)}" loading="lazy"></div>
      </div>
      <div>
        <p class="sobre__bio reveal">${esc(Site.t(a.bio))}</p>
        <p class="sobre__personal reveal">${esc(Site.t(a.personal))}</p>

        <div class="sobre__bloque reveal">
          <h3>${esc(Site.t(L.education))}</h3>
          <div class="chips">${a.education.map(e => `<span class="chip">${esc(Site.t(e))}</span>`).join("")}</div>
        </div>

        <div class="sobre__bloque reveal">
          <h3>${esc(Site.t(L.experience))}</h3>
          <div class="timeline">
            ${a.experience.map(exp => `
              <div class="timeline__item">
                <div class="timeline__periodo">${esc(exp.period)}</div>
                <div class="timeline__cuerpo">
                  <h4>${esc(Site.t(exp.role))}</h4>
                  <span class="timeline__empresa">${esc(Site.t(exp.company))}</span>
                  <p>${esc(Site.t(exp.description))}</p>
                </div>
              </div>`).join("")}
          </div>
        </div>

        <div class="sobre__bloque reveal">
          <h3>${esc(Site.t(L.certifications))}</h3>
          <div class="certs-grid">
            ${a.certifications.map((cert, i) => `
              <button class="cert-tarjeta" data-cert="${i}" type="button"
                      aria-label="${esc(Site.t(L.certExpand))}: ${esc(Site.t(cert.name))}">
                <img src="${esc(imgSrc(cert.image, "img/certificados/cert-1.png"))}" alt="${esc(Site.t(cert.name))}" loading="lazy">
                <span class="cert-tarjeta__info">
                  <span class="cert-tarjeta__nombre">${esc(Site.t(cert.name))}</span>
                  <span class="cert-tarjeta__emisor">${esc(cert.issuer)}</span>
                </span>
              </button>`).join("")}
          </div>
        </div>

        <div class="sobre__bloque reveal">
          <h3>${esc(Site.t(L.industries))}</h3>
          <div class="chips">${a.industries.map(i => `<span class="chip">${esc(Site.t(i))}</span>`).join("")}</div>
        </div>

        <div class="sobre__bloque reveal">
          <h3>${esc(Site.t(L.languages))}</h3>
          <div class="chips">${a.languages.map(l => `<span class="chip">${esc(Site.t(l))}</span>`).join("")}</div>
        </div>
      </div>
    </div>`;
  document.getElementById("sobreMiTitulo").textContent = Site.t(c.ui.sections.about);
}

/* Rellena el modal de certificado con la imagen ampliada */
function fillCertModal(index) {
  const cert = Site.content.about.certifications[index];
  if (!cert) return;
  document.getElementById("certCuerpo").innerHTML = `
    <img class="cert-full" src="${esc(imgSrc(cert.image, "img/certificados/cert-1.png"))}" alt="${esc(Site.t(cert.name))}">
    <div class="cert-full__info">
      <h3>${esc(Site.t(cert.name))}</h3>
      <span>${esc(cert.issuer)}</span>
    </div>`;
}

function renderServices() {
  const c = Site.content, L = c.ui.labels;
  const contenido = c.services.length
    ? `<div class="servicios__grid">
      ${c.services.map((s, i) => `
        <article class="servicio reveal" data-delay="${(i % 3) + 1}">
          <div class="servicio__icono">${icon(s.icon)}</div>
          <h3>${esc(Site.t(s.title))}</h3>
          <p>${esc(Site.t(s.description))}</p>
          <div class="servicio__entrega"><strong>${esc(Site.t(L.includes))}</strong>${esc(Site.t(s.deliverable))}</div>
          <div class="chips">${s.tech.map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>
        </article>`).join("")}
    </div>`
    : `<p class="vacio">${esc(Site.t(L.noServices))}</p>`;
  document.getElementById("serviciosInner").innerHTML = contenido + `
    <p class="servicios__nota reveal">${esc(Site.t(L.budgetNote))}</p>`;
  document.getElementById("serviciosTitulo").textContent = Site.t(c.ui.sections.services);
}

function renderProcess() {
  const c = Site.content;
  document.getElementById("procesoInner").innerHTML = `
    <div class="proceso__grid">
      ${c.process.map((p, i) => `
        <div class="paso reveal" data-delay="${i + 1}">
          <div class="paso__num">0${i + 1}</div>
          <h3>${esc(Site.t(p.title))}</h3>
          <p>${esc(Site.t(p.description))}</p>
        </div>`).join("")}
    </div>`;
  document.getElementById("procesoTitulo").textContent = Site.t(c.ui.sections.process);
}

function renderProjects() {
  const c = Site.content, L = c.ui.labels;
  const contenido = c.projects.length
    ? `<div class="proyectos__grid">
      ${c.projects.map((p, i) => `
        <article class="proyecto reveal" data-delay="${(i % 3) + 1}" data-index="${i}" tabindex="0" role="button"
                 aria-label="${esc(Site.t(L.viewProject))}: ${esc(Site.t(p.title))}">
          <div class="proyecto__media">
            <span class="proyecto__etiqueta">${esc(Site.t(p.sector))}</span>
            ${imgSrc(p.image, "")
              ? `<img src="${esc(imgSrc(p.image, ""))}" alt="${esc(Site.t(p.title))}" loading="lazy">`
              : `<div class="media-placeholder">${icon("software")}</div>`}
          </div>
          <div class="proyecto__contenido">
            <h3>${esc(Site.t(p.title))}</h3>
            <p class="proyecto__resumen">${esc(Site.t(p.problem))}</p>
            <p class="proyecto__tecnologias">${p.tech.slice(0, 4).map(esc).join(" · ")}</p>
            <div class="proyecto__footer">
              <span class="proyecto__anio">${esc(p.year)}</span>
              <span class="proyecto__ver">${esc(Site.t(L.viewProject))} ${icon("arrow")}</span>
            </div>
          </div>
        </article>`).join("")}
    </div>`
    : `<p class="vacio">${esc(Site.t(L.noProjects))}</p>`;
  document.getElementById("proyectosInner").innerHTML = contenido;
  document.getElementById("proyectosTitulo").textContent = Site.t(c.ui.sections.projects);
}

/* Rellena el modal con el detalle de un proyecto */
function fillProjectModal(index) {
  const p = Site.content.projects[index];
  const L = Site.content.ui.labels;
  if (!p) return;
  const item = (label, txt) => `<div class="modal__item"><strong>${esc(Site.t(label))}</strong><p>${esc(Site.t(txt))}</p></div>`;
  document.getElementById("modalCuerpo").innerHTML = `
    <div class="modal__media">${p.image
      ? `<img src="${esc(p.image)}" alt="${esc(Site.t(p.title))}">`
      : `<div class="media-placeholder">${icon("software")}</div>`}</div>
    <div class="modal__cuerpo">
      <span class="proyecto__etiqueta" style="position:static">${esc(Site.t(p.sector))} · ${esc(p.year)}${p.client ? " · " + esc(p.client) : ""}</span>
      <h3>${esc(Site.t(p.title))}</h3>
      ${item(L.problem, p.problem)}
      ${item(L.solution, p.solution)}
      ${item(L.result, p.result)}
      <div class="modal__item"><strong>${esc(Site.t(L.tech))}</strong>
        <div class="chips">${p.tech.map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>
      </div>
      ${p.link ? `<a class="btn btn--secundario btn--chico" href="${esc(p.link)}" target="_blank" rel="noopener">${esc(p.link)}</a>` : ""}
    </div>`;
}

function renderContact() {
  const c = Site.content, ct = c.contact, ui = c.ui.form, L = c.ui.labels;
  const canales = [];
  if (ct.whatsapp) canales.push(`<a class="canal" href="${waUrl()}" target="_blank" rel="noopener">${icon("whatsapp")}<div><div class="rotulo">WhatsApp</div><div class="valor">+${esc(ct.whatsapp)}</div></div></a>`);
  if (ct.email) canales.push(`<a class="canal" href="mailto:${esc(ct.email)}">${icon("mail")}<div><div class="rotulo">Email</div><div class="valor">${esc(ct.email)}</div></div></a>`);
  if (ct.linkedin) canales.push(`<a class="canal" href="${esc(ct.linkedin)}" target="_blank" rel="noopener">${icon("linkedin")}<div><div class="rotulo">LinkedIn</div><div class="valor">${esc(ct.linkedin.replace(/^https?:\/\//, ""))}</div></div></a>`);
  if (ct.github) canales.push(`<a class="canal" href="${esc(ct.github)}" target="_blank" rel="noopener">${icon("github")}<div><div class="rotulo">GitHub</div><div class="valor">${esc(ct.github.replace(/^https?:\/\//, ""))}</div></div></a>`);

  document.getElementById("contactoInner").innerHTML = `
    <div class="contacto__grid">
      <div class="contacto__info reveal">
        <h3>${esc(Site.t(ui.titleInfo || ui.title))}</h3>
        <p>${esc(Site.t(ct.availability))}</p>
        <div class="contacto__canales">${canales.join("")}</div>
      </div>
      <form class="formulario reveal" data-delay="1" id="formContacto" novalidate>
        <h3>${esc(Site.t(ui.title))}</h3>
        <div class="campo">
          <label for="f-nombre">${esc(Site.t(ui.name))} *</label>
          <input id="f-nombre" name="nombre" type="text" placeholder="${esc(Site.t(ui.namePh))}" required>
        </div>
        <div class="campo">
          <label for="f-email">${esc(Site.t(ui.email))} *</label>
          <input id="f-email" name="email" type="email" placeholder="${esc(Site.t(ui.emailPh))}" required>
        </div>
        <div class="campo">
          <label for="f-servicio">${esc(Site.t(ui.service))}</label>
          <select id="f-servicio" name="servicio">
            ${ct.formServices.map(s => `<option value="${esc(Site.t(s))}">${esc(Site.t(s))}</option>`).join("")}
          </select>
        </div>
        <div class="campo">
          <label for="f-mensaje">${esc(Site.t(ui.message))} *</label>
          <textarea id="f-mensaje" name="mensaje" placeholder="${esc(Site.t(ui.messagePh))}" required></textarea>
        </div>
        <button class="btn btn--principal" type="submit" id="btnEnviar">${esc(Site.t(ui.send))}</button>
        <p class="formulario__estado" id="formEstado" role="status"></p>
      </form>
    </div>`;
  document.getElementById("contactoTitulo").textContent = Site.t(c.ui.sections.contact);
}

function renderFooter() {
  const c = Site.content, ui = c.ui.footer;
  document.getElementById("footerInner").innerHTML = `
    <div class="footer__marca">
      <img src="${esc(c.profile.logo)}" alt="Logo">
      <div><strong>${esc(c.profile.name)}</strong><div class="slogan">${esc(Site.t(c.profile.slogan))}</div></div>
    </div>
    <p>© <span id="anio"></span> ${esc(c.profile.name)} · ${esc(Site.t(ui.rights))}</p>
    <p class="mono">${esc(Site.t(ui.made))}</p>`;
  document.getElementById("anio").textContent = new Date().getFullYear();
}

function renderFloaters() {
  const ct = Site.content.contact;
  const botones = [];
  if (ct.whatsapp) botones.push(`<a class="flotante flotante--wa" href="${waUrl()}" target="_blank" rel="noopener" data-tooltip="WhatsApp" aria-label="WhatsApp">${icon("whatsapp")}</a>`);
  if (ct.linkedin) botones.push(`<a class="flotante flotante--li" href="${esc(ct.linkedin)}" target="_blank" rel="noopener" data-tooltip="LinkedIn" aria-label="LinkedIn">${icon("linkedin")}</a>`);
  if (ct.github) botones.push(`<a class="flotante flotante--gh" href="${esc(ct.github)}" target="_blank" rel="noopener" data-tooltip="GitHub" aria-label="GitHub">${icon("github")}</a>`);
  document.getElementById("flotantes").innerHTML = botones.join("");
}

/* ---------- Arranque ---------- */
document.addEventListener("DOMContentLoaded", () => Site.init());
