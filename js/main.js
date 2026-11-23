/* ============================================================
   INTERACCIONES DEL SITIO
   Menú, animaciones, efecto de tipeo, modal y formulario.
   ============================================================ */

/* ---------- Barra de navegación ---------- */
function initNav() {
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const menu = document.getElementById("navMenu");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("nav--scrolled", window.scrollY > 30);
  }, { passive: true });

  burger.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    burger.classList.toggle("abierto", abierto);
    burger.setAttribute("aria-expanded", abierto);
    document.body.style.overflow = abierto ? "hidden" : "";
  });

  /* Cerrar el menú móvil al hacer clic en un enlace */
  menu.addEventListener("click", e => {
    if (e.target.closest("a")) {
      menu.classList.remove("abierto");
      burger.classList.remove("abierto");
      document.body.style.overflow = "";
    }
  });

  /* Resaltar el enlace de la sección visible */
  const secciones = document.querySelectorAll("section[id]");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        document.querySelectorAll(".nav__link").forEach(l =>
          l.classList.toggle("activo", l.dataset.seccion === en.target.id));
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  secciones.forEach(s => obs.observe(s));
}

/* ---------- Animación de aparición (reveal) ---------- */
let revealObserver = null;
function initReveal() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        revealObserver.unobserve(en.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll(".reveal:not(.visible)").forEach(el => revealObserver.observe(el));
}

/* ---------- Contadores animados ---------- */
let counterObserver = null;
function initCounters() {
  if (counterObserver) counterObserver.disconnect();
  counterObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const fin = parseInt(el.dataset.contador, 10) || 0;
      const t0 = performance.now(), dur = 1400;
      (function paso(t) {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(paso);
      })(t0);
      counterObserver.unobserve(el);
    });
  }, { threshold: .6 });
  document.querySelectorAll("[data-contador]").forEach(el => counterObserver.observe(el));
}

/* ---------- Efecto de tipeo en el rol del hero ---------- */
/* Un token por render evita que queden loops viejos escribiendo
   en elementos desconectados al cambiar de idioma */
let typedToken = 0;
function initTyped() {
  const el = document.getElementById("typed");
  if (!el) return;
  const miToken = ++typedToken;
  const texto = Site.t(Site.content.profile.role);
  let i = 0, borrando = false;
  el.textContent = "";
  (function tick() {
    if (miToken !== typedToken || !el.isConnected) return;
    if (!borrando) {
      el.textContent = texto.slice(0, ++i);
      if (i === texto.length) { borrando = true; setTimeout(tick, 3200); return; }
      setTimeout(tick, 34);
    } else {
      el.textContent = texto.slice(0, --i);
      if (i === 0) { borrando = false; setTimeout(tick, 500); return; }
      setTimeout(tick, 12);
    }
  })();
}

/* ---------- Modal de proyectos ---------- */
function initModal() {
  const modal = document.getElementById("modal");
  const cerrar = () => {
    modal.classList.remove("abierto");
    document.body.style.overflow = "";
  };

  document.getElementById("proyectosInner").addEventListener("click", e => {
    const card = e.target.closest(".proyecto");
    if (card) { fillProjectModal(+card.dataset.index); modal.classList.add("abierto"); document.body.style.overflow = "hidden"; }
  });
  document.getElementById("proyectosInner").addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const card = e.target.closest(".proyecto");
    if (card) { fillProjectModal(+card.dataset.index); modal.classList.add("abierto"); document.body.style.overflow = "hidden"; }
  });
  document.getElementById("modalCerrar").addEventListener("click", cerrar);
  modal.addEventListener("click", e => { if (e.target.classList.contains("modal__fondo")) cerrar(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") cerrar(); });
}

/* ---------- Formulario de contacto (Web3Forms o WhatsApp) ---------- */
function initForm() {
  const form = document.getElementById("formContacto");
  if (!form) return;
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const estado = document.getElementById("formEstado");
    const btn = document.getElementById("btnEnviar");
    const ct = Site.content.contact;
    const ui = Site.content.ui.form;

    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const servicio = form.servicio.value;
    const mensaje = form.mensaje.value.trim();

    if (!nombre || !email || !mensaje) {
      estado.textContent = "⚠ " + Site.t({ es: "Completá los campos obligatorios.", en: "Please fill in the required fields." });
      estado.className = "formulario__estado error";
      return;
    }

    btn.disabled = true;
    btn.textContent = Site.t(ui.sending);
    estado.textContent = "";

    /* Si hay clave de Web3Forms configurada, se envía por email.
       Si no, la consulta se deriva a WhatsApp con el mensaje armado. */
    if (ct.web3formsKey) {
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            access_key: ct.web3formsKey,
            subject: "Consulta web: " + servicio,
            from_name: nombre,
            Nombre: nombre, Email: email, Servicio: servicio, Mensaje: mensaje
          })
        });
        const data = await res.json();
        if (data.success) {
          estado.textContent = "✅ " + Site.t(ct.confirmation);
          estado.className = "formulario__estado ok";
          form.reset();
        } else { throw new Error(data.message || "Error"); }
      } catch (err) {
        estado.textContent = "⚠ " + Site.t(ui.error);
        estado.className = "formulario__estado error";
      }
    } else {
      const texto = `Hola, soy ${nombre} (${email}).\nServicio: ${servicio}\n\n${mensaje}`;
      window.open("https://wa.me/" + ct.whatsapp + "?text=" + encodeURIComponent(texto), "_blank");
      estado.textContent = "✅ " + Site.t({ es: "Se abrió WhatsApp con tu mensaje listo para enviar.", en: "WhatsApp opened with your message ready to send." });
      estado.className = "formulario__estado ok";
    }
    btn.disabled = false;
    btn.textContent = Site.t(ui.send);
  });
}

/* ---------- Modal de certificados ---------- */
function initCertModal() {
  const modal = document.getElementById("certModal");
  const cerrar = () => { modal.classList.remove("abierto"); document.body.style.overflow = ""; };
  document.getElementById("sobreMiInner").addEventListener("click", e => {
    const btn = e.target.closest(".cert-tarjeta");
    if (btn) { fillCertModal(+btn.dataset.cert); modal.classList.add("abierto"); document.body.style.overflow = "hidden"; }
  });
  document.getElementById("certCerrar").addEventListener("click", cerrar);
  modal.addEventListener("click", e => { if (e.target.classList.contains("modal__fondo")) cerrar(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("abierto")) cerrar(); });
}

/* ---------- Se re-ejecuta después de cada render ---------- */
window.SiteAfterRender = function () {
  initReveal();
  initCounters();
  initTyped();
  initForm();
};

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initModal();
  initCertModal();
});
