# Design System "Thoughts" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar al blog un design system elegante y minimalista que replique la identidad visual calmada de miguelintech.com (Outfit + Inter, paleta slate con degradado #046bd2→#26b7cd, tarjetas suaves, píldoras, rejilla sutil).

**Architecture:** Tokens CSS en `global.css` consumidos por clases existentes; cambios de markup mínimos (ProfileHero pasa de SVG a foto real; BaseLayout añade las fuentes). Cero dependencias nuevas, sin animaciones.

**Tech Stack:** Astro 5, CSS vanilla con custom properties, Google Fonts, Python stdlib para el PNG OG.

**Spec:** `docs/superpowers/specs/2026-08-22-design-system.md`

**Rama:** `feat/design-system` (crear en Task 1 desde `main`)

---

### Task 1: Fundaciones — tokens, base y fuentes

**Files:**
- Modify: `src/styles/global.css` (bloque inicial)
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 0: Crear rama**

Run: `git checkout -b feat/design-system`
Expected: `Switched to a new branch 'feat/design-system'`

- [ ] **Step 1: Reemplazar el bloque inicial de `src/styles/global.css`**

Sustituir TODO el bloque desde `:root {` hasta la línea `a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }` (incluida) por:

```css
:root {
  /* Tipografía */
  --font-heading: 'Outfit', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;

  /* Color */
  --bg: #f8fafc;
  --surface: #ffffff;
  --text: #0f172a;
  --muted: #64748b;
  --accent-primary: #046bd2;
  --accent-secondary: #26b7cd;
  --accent-gradient: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  --border: #e2e8f0;

  /* Radios */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-pill: 999px;

  /* Sombras y movimiento */
  --shadow-card: 0 20px 40px -15px rgba(15, 23, 42, 0.08);
  --shadow-hover: 0 30px 60px -15px rgba(4, 107, 210, 0.12);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);

  --max-width: 44rem;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: var(--font-body);
  line-height: 1.7;
  color: var(--text);
  background: var(--bg);
}

/* Rejilla sutil del portafolio (estática, sin animación) */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(4, 107, 210, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(4, 107, 210, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
}

.container {
  max-width: var(--max-width);
  margin-inline: auto;
  padding-inline: 1rem;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 700;
  letter-spacing: -0.02em;
}

h1 { font-weight: 800; }

a { color: var(--accent-primary); }
a:hover { text-decoration: none; }
a:focus-visible { outline: 2px solid var(--accent-primary); outline-offset: 2px; }
```

El resto del archivo (`.site-header` en adelante) queda intacto en esta tarea.

- [ ] **Step 2: Añadir fuentes y theme-color en `src/layouts/BaseLayout.astro`**

Después de la línea `<link rel="sitemap" href="/sitemap-index.xml" />` insertar:

```html
    <meta name="theme-color" content="#f8fafc" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet" />
```

- [ ] **Step 3: Verificar**

Run: `npm run build`
Expected: build exitoso.

Run: `grep -o 'fonts.googleapis.com/css2[^"]*' dist/index.html | wc -l`
Expected: `1`

Run: `grep -o '<meta name="theme-color" content="#f8fafc"' dist/index.html | wc -l`
Expected: `1`

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro
git commit -m "feat: tokens de diseño y tipografías del portafolio"
```

---

### Task 2: Cabecera fija con marca degradada

**Files:**
- Modify: `src/styles/global.css` (reglas del header)

- [ ] **Step 1: Reemplazar las reglas del header**

Sustituir estas reglas actuales (bloque contiguo desde `.site-header {` hasta `nav a:hover { color: var(--text); }` incluida):

```css
.site-header { border-bottom: 1px solid var(--border); }
.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: 1rem;
}
.site-title {
  font-weight: 700;
  font-size: 1.125rem;
  text-decoration: none;
  color: var(--text);
}
nav { display: flex; gap: 1rem; }
nav a { color: var(--muted); text-decoration: none; }
nav a:hover { color: var(--text); }
```

por:

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: 1rem;
}
.site-title {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  text-decoration: none;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
nav { display: flex; gap: 1.25rem; }
nav a {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
}
nav a:hover { color: var(--accent-primary); }
```

Nota: el markup de `Header.astro` NO cambia. El outline de focus sigue visible sobre texto transparente (es un outline de caja).

- [ ] **Step 2: Verificar**

Run: `npm run build`
Expected: build exitoso.

Run: `grep -o 'backdrop-filter:blur(12px)' dist/index.html | wc -l`
Expected: `1`

Run: `grep -o 'class="site-title"' dist/index.html | wc -l`
Expected: `1`

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: cabecera fija con marca degradada"
```

---

### Task 3: Avatar real con anillo degradado

**Files:**
- Create: `public/avatar.png`
- Modify: `src/components/ProfileHero.astro`
- Modify: `src/styles/global.css` (regla `.profile-avatar svg`)

- [ ] **Step 1: Descargar la foto del portafolio**

```bash
curl -sL https://miguelintech.com/img/1.png -o public/avatar.png
file public/avatar.png
```

Expected: `public/avatar.png: PNG image data, 475 x 450, 8-bit colormap, non-interlaced`

Si el tipo no es PNG, reportar BLOCKED con la salida de `file`.

- [ ] **Step 2: Sustituir el SVG por la imagen en `src/components/ProfileHero.astro`**

Reemplazar el bloque completo del SVG:

```astro
    <svg viewBox="0 0 96 96" width="96" height="96" aria-hidden="true">
      <circle cx="48" cy="48" r="48" fill="#1d4ed8"></circle>
      <text x="48" y="62" font-family="system-ui, sans-serif" font-size="40" font-weight="700" fill="#ffffff" text-anchor="middle">M</text>
    </svg>
```

por:

```astro
    <img src="/avatar.png" alt="" width="112" height="112" loading="eager" />
```

(`alt=""` porque el nombre está adyacente como `<h1>`; el resto del componente no cambia.)

- [ ] **Step 3: Reemplazar la regla CSS del avatar**

Sustituir:

```css
.profile-avatar svg {
  display: block;
  border-radius: 50%;
}
```

por:

```css
.profile-avatar {
  background: var(--accent-gradient);
  padding: 3px;
  border-radius: 50%;
  box-shadow: var(--shadow-card);
}

.profile-avatar img {
  display: block;
  width: 112px;
  height: 112px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #fff;
}
```

(La media query móvil de `.profile-hero` se queda igual.)

- [ ] **Step 4: Verificar**

Run: `npm run build`
Expected: build exitoso.

Run: `ls dist/avatar.png && grep -o '<img src="/avatar.png"[^>]*>' dist/index.html | wc -l`
Expected: lista el archivo y `1`

- [ ] **Step 5: Commit**

```bash
git add public/avatar.png src/components/ProfileHero.astro src/styles/global.css
git commit -m "feat: avatar real con anillo degradado"
```

---

### Task 4: Tarjetas de post y píldoras de etiquetas

**Files:**
- Modify: `src/styles/global.css` (bloques `.post-card*`, `.tags*`, `.featured-heading`)

- [ ] **Step 1: Reemplazar el bloque de tarjetas**

Sustituir:

```css
.post-card { padding-block: 1.5rem; border-bottom: 1px solid var(--border); }
.post-card time { color: var(--muted); font-size: 0.875rem; }
.post-card h2 { margin: 0.25rem 0; font-size: 1.25rem; }
.post-card h2 a { color: var(--text); text-decoration: none; }
.post-card h2 a:hover { color: var(--accent); }
```

por:

```css
.post-card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 1.5rem;
  transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
}
.post-card + .post-card { margin-top: 1rem; }
.post-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}
.post-card time { color: var(--muted); font-size: 0.875rem; }
.post-card h2 { margin: 0.25rem 0; font-size: 1.25rem; }
.post-card h2 a { color: var(--text); text-decoration: none; }
.post-card h2 a:hover { color: var(--accent-primary); }
.post-card p { color: var(--muted); margin-bottom: 0; }
```

- [ ] **Step 2: Reemplazar el bloque de tags**

Sustituir:

```css
.tags {
  list-style: none;
  display: flex;
  gap: 0.5rem;
  padding: 0;
  margin: 0.5rem 0 0;
  flex-wrap: wrap;
}
.tags a { color: var(--muted); font-size: 0.875rem; text-decoration: none; }
.tags a:hover { color: var(--accent); }
```

por:

```css
.tags {
  list-style: none;
  display: flex;
  gap: 0.5rem;
  padding: 0;
  margin: 0.75rem 0 0;
  flex-wrap: wrap;
}
.tags a {
  background: rgba(4, 107, 210, 0.08);
  color: var(--accent-primary);
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.3s var(--ease), color 0.3s var(--ease);
}
.tags a:hover {
  background: var(--accent-primary);
  color: #fff;
}
```

- [ ] **Step 3: Reemplazar `.featured-heading`**

Sustituir:

```css
.featured-heading {
  font-size: 1.25rem;
  margin-block: 0 0.5rem;
}
```

por:

```css
.featured-heading {
  font-size: 1.25rem;
  margin-block: 0 1rem;
}

.featured-heading::after {
  content: '';
  display: block;
  width: 64px;
  height: 4px;
  border-radius: 4px;
  background: var(--accent-gradient);
  margin-top: 0.5rem;
}
```

- [ ] **Step 4: Verificar**

Run: `npm run build`
Expected: build exitoso.

Run: `grep -o '<article class="post-card">' dist/index.html | wc -l`
Expected: `1`

Run: `grep -o 'translateY(-4px)' dist/index.html | wc -l`
Expected: al menos `1` (CSS inline en el HTML)

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: tarjetas de post y píldoras de etiquetas"
```

---

### Task 5: Prosa, favicon y OG con la nueva paleta

**Files:**
- Modify: `src/styles/global.css` (bloque `.prose`)
- Modify: `public/favicon.svg` (reescritura completa)
- Regenerate: `public/og-default.png`

(`.site-footer` no cambia: sus reglas siguen válidas con los nuevos tokens.)

- [ ] **Step 1: Reemplazar el bloque de prosa**

Sustituir:

```css
.prose img { max-width: 100%; height: auto; }
.prose h2 { margin-top: 2rem; margin-bottom: 0.75rem; }
.prose h3 { margin-top: 1.5rem; margin-bottom: 0.5rem; }
.prose pre { overflow-x: auto; padding: 1rem; background: var(--muted-bg, #f6f8fa); border-radius: 8px; }
.prose code { background: var(--muted-bg, #f6f8fa); padding: 0.125rem 0.25rem; border-radius: 4px; font-size: 0.9em; }
.prose pre code { background: none; padding: 0; }
```

por:

```css
.prose img { max-width: 100%; height: auto; border-radius: var(--radius-md); }
.prose h2 { margin-top: 2rem; margin-bottom: 0.75rem; }
.prose h3 { margin-top: 1.5rem; margin-bottom: 0.5rem; }
.prose a { text-decoration: none; }
.prose a:hover { text-decoration: underline; text-underline-offset: 3px; }
.prose blockquote {
  margin-inline: 0;
  padding-left: 1rem;
  border-left: 3px solid var(--accent-primary);
  font-style: italic;
  color: var(--muted);
}
.prose pre {
  overflow-x: auto;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: var(--radius-sm);
}
.prose code { background: #f1f5f9; padding: 0.125rem 0.25rem; border-radius: 6px; font-size: 0.9em; }
.prose pre code { background: none; padding: 0; }
```

- [ ] **Step 2: Reescribir `public/favicon.svg`**

Contenido completo nuevo (degradado azul→cian, misma forma):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#046bd2"/><stop offset="1" stop-color="#26b7cd"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g)"/><text x="32" y="44" font-family="system-ui, sans-serif" font-size="36" font-weight="700" fill="#ffffff" text-anchor="middle">t</text></svg>
```

- [ ] **Step 3: Regenerar `public/og-default.png` con degradado horizontal**

Run:

```bash
python3 - <<'PY'
import struct, zlib

W, H = 1200, 630
c1 = (0x04, 0x6B, 0xD2)
c2 = (0x26, 0xB7, 0xCD)

row = bytearray(b'\x00')
for x in range(W):
    t = x / (W - 1)
    row += bytes(round(a + (b - a) * t) for a, b in zip(c1, c2))
raw = bytes(row) * H

def chunk(t, d):
    c = t + d
    return struct.pack('>I', len(d)) + c + struct.pack('>I', zlib.crc32(c))

png = (
    b'\x89PNG\r\n\x1a\n'
    + chunk(b'IHDR', struct.pack('>IIBBBBB', W, H, 8, 2, 0, 0, 0))
    + chunk(b'IDAT', zlib.compress(raw))
    + chunk(b'IEND', b'')
)
with open('public/og-default.png', 'wb') as f:
    f.write(png)
print('ok')
PY
```

Expected: imprime `ok`.

Run: `file public/og-default.png`
Expected: `public/og-default.png: PNG image data, 1200 x 630, 8-bit/color RGB, non-interlaced`

- [ ] **Step 4: Verificar build**

Run: `npm run build && grep -o 'url(#g)' dist/favicon.svg | wc -l`
Expected: build exitoso y `1`

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css public/favicon.svg public/og-default.png
git commit -m "feat: prosa pulida y assets con la nueva paleta"
```

---

### Task 6: Verificación integral

**Files:** ninguno (solo verificación; arreglar y commitear si algo falla).

- [ ] **Step 1: Build limpio**

Run: `rm -rf .astro dist && npm run build`
Expected: `X page(s) built` con X ≥ 9, sin warnings.

- [ ] **Step 2: Batería de greps sobre `dist/index.html`**

| Check | Comando | Esperado |
|---|---|---|
| Fuentes | `grep -o 'fonts.googleapis.com[^"]*' dist/index.html \| wc -l` | `1` |
| Theme color | `grep -o '<meta name="theme-color"' dist/index.html \| wc -l` | `1` |
| Un solo h1 | `grep -o '<h1>[^<]*</h1>' dist/index.html` | `<h1>Miguel Bastidas</h1>` |
| Perfil | `grep -o 'class="profile-hero"' dist/index.html \| wc -l` | `1` |
| Avatar | `grep -o '<img src="/avatar.png"' dist/index.html \| wc -l` | `1` |
| Card destacado | `grep -o '<article class="post-card">' dist/index.html \| wc -l` | `1` |
| Sin keyframes | `grep -c '@keyframes' src/styles/global.css` | `0` |

- [ ] **Step 3: Sin regresiones en otras páginas**

Run: `grep -o '<h1>[^<]*</h1>' dist/blog/index.html`
Expected: `<h1>Todos los posts</h1>`

Run: `grep -o '<article class="post-card">' dist/blog/index.html | wc -l`
Expected: `2` (los dos posts publicados, ahora como tarjetas)

Run: `find dist -name '*.html' | wc -l && grep -rl 'og:title' dist --include='*.html' | wc -l`
Expected: números iguales (todas las páginas conservan OG)

- [ ] **Step 4: Lighthouse (si hay Chrome disponible)**

```bash
npm run preview &
sleep 3
npx --yes lighthouse http://localhost:4321/ --quiet --chromeFlags="--headless=new" --onlyCategories=performance,seo,best-practices
kill %1
```

Expected: SEO 100, Best Practices 100, Performance ≥ 90 (las fuentes externas pueden costar algunos puntos; eso está permitido por el spec). Si no hay Chrome instalado, reportarlo y continuar sin bloquear.

- [ ] **Step 5: Reporte**

Sin cambios que commitear si todo pasa; si hubo arreglo, commit con prefijo `fix:`.

---

## Auto-revisión del plan (hecha al escribirlo)

- **Cobertura del spec:** tokens+tipografías+grid (T1), header sticky/degradado (T2), avatar real con anillo (T3), tarjetas+píldoras+barra destacada (T4), prosa+favicon+OG (T5), verificación completa (T6). Contraste: pares documentados en el spec, todos AA. ✔
- **Placeholders:** ninguno; todos los pasos tienen código/comando exactos. ✔
- **Consistencia:** nombres de clase idénticos a los componentes existentes (`.site-header`, `.profile-hero`, `.post-card`, `.tags`, `.featured-heading`, `.prose`); `var(--accent)` antiguo eliminado en los bloques reemplazados (no quedan usos: verificado contra el contenido actual de global.css). ✔
