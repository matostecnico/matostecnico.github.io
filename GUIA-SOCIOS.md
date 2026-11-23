# Guía para socios · Tu web profesional sin saber programar

Esta guía te permite tener **tu propia página web profesional** y modificarla vos mismo, **gratis** y **sin escribir una sola línea de código**.

Tiempo total estimado: **30–40 minutos** la primera vez.

---

## ¿Qué vas a lograr?

- Una web como la de Angel, pero con **tus** datos, servicios y proyectos.
- Un **panel de administración** en tu propia web (`tusitio.com/admin.html`) para cambiar textos, fotos y proyectos con formularios simples.
- Publicación **gratis** en GitHub Pages (una dirección tipo `tu-usuario.github.io`).

---

## PASO 1 · Conseguir los archivos

1. Pedile a Angel la carpeta del proyecto (o descargala como ZIP desde GitHub: botón verde **Code → Download ZIP**).
2. Descomprimila en tu computadora. Vas a ver archivos como `index.html`, `admin.html`, carpetas `css`, `js`, `img`, etc.

> **No hace falta instalar nada** para editar el contenido. Solo un navegador (Chrome, Edge, Firefox…).

---

## PASO 2 · Personalizar tu web desde el panel

1. Abrí el archivo **`admin.html`** con doble clic (se abre en tu navegador).
2. Ingresá con:
   - **Usuario:** `admin`
   - **Contraseña:** `admin2026`
3. **Lo primero: cambiá la contraseña** (botón **🔑 Clave** arriba a la derecha) para que nadie más pueda editar tu panel.
4. Recorré las pestañas y completá tus datos:
   - **👤 Perfil:** tu nombre, rol, foto.
   - **🏠 Portada:** el titular y los botones principales.
   - **🙋 Sobre mí:** tu presentación, formación y habilidades.
   - **⚙️ Servicios:** lo que ofrecés (podés agregar o quitar).
   - **🚀 Proyectos:** tus trabajos con problema → solución → resultado.
   - **📞 Contacto:** tu WhatsApp, email, LinkedIn…
   - **🔍 SEO:** cómo aparecés en Google.
5. Cada campo tiene su versión en **español (ES)** e **inglés (EN)**: tu web es bilingüe y los visitantes cambian de idioma con el botón ES/EN.
6. Al terminar, tocá **💾 Guardar**.

> Los cambios guardados se ven **en tu navegador** apenas los guardás (botón **👁 Ver sitio**). Para que los vea **todo el mundo en internet**, seguí el paso 3.

### Cambiar las fotos

- Reemplazá los archivos en la carpeta `img/` **con el mismo nombre**:
  - `img/perfil.jpg` → tu foto (cuadrada, mínimo 400×400 px).
  - `img/logo.png` → tu logo.
  - `img/proyectos/` → fotos de tus proyectos (sin espacios ni tildes en el nombre).
- Comprimí las imágenes en [squoosh.app](https://squoosh.app) para que la web cargue rápido.

---

## PASO 3 · Publicar tu web en internet (gratis)

### Primera vez

1. Creá una cuenta gratis en [github.com](https://github.com) (solo email y contraseña).
2. Una vez dentro, tocá el **+** de arriba a la derecha → **New repository**.
3. En **Repository name** escribí: `tu-usuario.github.io` (reemplazá `tu-usuario` por tu nombre de usuario de GitHub, **exacto**).
4. Marcá **Public** y tocá **Create repository**.
5. En la página que aparece, tocá el enlace **uploading an existing file**.
6. **Arrastrá todos los archivos y carpetas** del proyecto a esa ventana.
7. Esperá a que suban y tocá el botón verde **Commit changes**.
8. Esperá 1–2 minutos y entrá a **`https://tu-usuario.github.io`** → **¡tu web está en el aire!** 🎉

### Publicar cambios (después de editar en el panel)

Cada vez que modifiques algo en el panel y quieras que se vea en internet:

1. En el panel (`admin.html`), tocá **⬇ Exportar**. Se descarga un archivo llamado **`content.js`**.
2. Entrá a tu repositorio en GitHub (`github.com/tu-usuario/tu-usuario.github.io`).
3. Navegá a la carpeta **`data`** → tocá **`content.js`**.
4. Tocá el ícono de **lápiz (Edit)** arriba a la derecha del archivo.
5. **Borrá todo** el contenido, abrí el `content.js` descargado con el Bloc de notas, **copiá todo** y pegalo en GitHub.
6. Bajá y tocá **Commit changes**.
7. En 1–2 minutos los cambios están en tu web.

> Si subiste una **foto nueva** (ej.: a `img/proyectos/`), también tenés que subirla en la misma carpeta del repositorio (botón **Add file → Upload files**).

---

## PASO 4 (opcional) · Recibir las consultas del formulario por email

Mientras no configures nada, el formulario de contacto **abre WhatsApp** con el mensaje del visitante ya escrito. Funciona bien y es gratis.

Si preferís recibirlas por **email**:

1. Entrá a [web3forms.com](https://web3forms.com) → poné tu email → te mandan una **Access Key** (gratis).
2. En el panel → pestaña **📞 Contacto** → pegá la clave en **Clave de Web3Forms**.
3. Guardá, exportá y publicá (paso 3). Listo: las consultas llegan a tu correo.

---

## Preguntas frecuentes

**¿Es realmente gratis?**
Sí. GitHub Pages no cobra nada. El único gasto opcional es un dominio propio (ej.: `tunombre.com`, unos USD 10–15/año), que podés conectar después.

**¿Qué pasa si toco algo y se rompe?**
Tranquilo: el botón **↺ Restablecer** del panel devuelve todo al contenido original. Además, antes de cambiar cosas grandes podés bajar una copia de la carpeta como respaldo.

**¿La clave del panel es segura?**
Es una barrera para que visitantes no entren a editar, suficiente para una web de portfolio. **No guardes ahí datos sensibles ni claves bancarias.** La seguridad real de tu sitio es tu cuenta de GitHub: solo quien tenga tu usuario y contraseña de GitHub puede publicar cambios.

**¿Puedo sacar la versión en inglés?**
Sí: dejá vacíos los campos en inglés… aunque lo recomendado es completarlos, te abre puertas a clientes internacionales.

**¿Puedo cambiar los colores?**
Sí, aunque es lo único que requiere tocar un archivo: abrí `css/variables.css` con el Bloc de notas y cambiá los códigos de color (hay comentarios que explican cada uno). Guardá y subí el archivo igual que en el paso 3.

**Quiero un dominio propio (tunombre.com), ¿cómo?**
Compralo en Namecheap o Cloudflare y seguí: repo → **Settings → Pages → Custom domain**. GitHub te guía con los DNS. Pedile ayuda a Angel la primera vez 🙂

---

## ¿Necesitás ayuda?

| Canal | Dato |
|---|---|
| WhatsApp de Angel | +54 11 2398-9145 |

*Última actualización: noviembre 2026*
