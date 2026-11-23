/* ============================================================
   SELECTOR DE IDIOMA (ES / EN)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-toggle button").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.lang === Site.lang) return;
      Site.lang = btn.dataset.lang;
      localStorage.setItem("siteLang", Site.lang);
      Site.renderAll();
    });
  });
});
