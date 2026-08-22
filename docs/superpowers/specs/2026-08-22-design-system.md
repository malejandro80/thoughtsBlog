# Design System "Thoughts" — Esencia del portafolio

**Fecha:** 2026-08-22 · **Estado:** aprobado por el usuario

## Objetivo

Aplicar al blog un sistema de diseño elegante y minimalista que replique la identidad visual de miguelintech.com en su versión calmada: mismas tipografías, misma paleta y patrones reconocibles (píldoras, tarjetas con sombras suaves, rejilla sutil), sin efectos llamativos (sin orbs animados, sin glassmorphism pesado, sin animaciones de degradado). La lectura manda.

## Decisiones previas (acordadas con el usuario)

1. **Fidelidad:** esencia calmada — tokens y patrones del portafolio, cero efectos animados.
2. **Avatar:** foto real del portafolio (`https://miguelintech.com/img/1.png`) con anillo degradado.
3. **Modo oscuro:** no. Solo tema claro, igual que el portafolio.
4. **Enfoque técnico:** A — tokens en `global.css`, cero dependencias nuevas, sin estilos scoped ni Tailwind.

## Tokens de diseño (`:root` en `global.css`)

| Token | Valor | Uso |
|---|---|---|
| `--font-heading` | `'Outfit', system-ui, sans-serif` | Títulos |
| `--font-body` | `'Inter', system-ui, sans-serif` | Cuerpo |
| `--bg` | `#f8fafc` | Fondo de página |
| `--surface` | `#ffffff` | Tarjetas/header |
| `--text` | `#0f172a` | Texto principal |
| `--muted` | `#64748b` | Texto secundario |
| `--accent-primary` | `#046bd2` | Enlaces, hover de píldoras |
| `--accent-secondary` | `#26b7cd` | Solo decorativo (degradados) |
| `--accent-gradient` | `linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))` | Marca, anillo, barras |
| `--border` | `#e2e8f0` | Bordes finos |
| `--radius-sm/md/lg/pill` | `8px / 16px / 24px / 999px` | Código / imágenes / tarjetas / píldoras |
| `--shadow-card` | `0 20px 40px -15px rgba(15,23,42,.08)` | Reposo de tarjetas y avatar |
| `--shadow-hover` | `0 30px 60px -15px rgba(4,107,210,.12)` | Hover de tarjetas |
| `--ease` | `cubic-bezier(0.16, 1, 0.3, 1)` | Todas las transiciones |
| `--max-width` | `44rem` | Contenedor (sin cambio) |

**Contraste verificado (AA):** `--text` sobre `--bg` ≈ 16:1 · `--muted` sobre `--bg` ≈ 4.5:1 · `--accent-primary` sobre blanco ≈ 5.2:1 · blanco sobre `--accent-primary` (hover de píldoras) ≈ 5.2:1.

## Tipografía y carga de fuentes

- Títulos `h1–h6`: Outfit, weight 800 para h1 / 700 resto, `letter-spacing: -0.02em`.
- Cuerpo: Inter 400, `line-height: 1.7`.
- Carga en `<head>` de `BaseLayout.astro` (idéntico al portafolio):
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet" />
  <meta name="theme-color" content="#f8fafc" />
  ```
- Trade-off aceptado: request externo a Google Fonts con `display=swap` (mismo patrón del portafolio) en lugar de self-hosting.

## Base

- Fondo `#f8fafc` con la rejilla sutil estática del portafolio:
  ```css
  body::before {
    content: ''; position: fixed; inset: 0; z-index: -1; pointer-events: none;
    background-image:
      linear-gradient(rgba(4, 107, 210, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(4, 107, 210, 0.03) 1px, transparent 1px);
    background-size: 30px 30px;
  }
  ```
- `a:focus-visible` se mantiene (outline 2px acento). Sin cambios de comportamiento.

## Cambios por archivo

### `src/styles/global.css` — reescritura completa
Organizado en secciones: Tokens → Reset/base → Header → Profile hero → Tarjetas → Tags → Prosa → Footer.

- **Header** (markup sin cambios, solo CSS): `position: sticky; top: 0; z-index: 10`, fondo `rgba(255,255,255,.85)` + `backdrop-filter: blur(12px)`, borde inferior. Marca `.site-title` en Outfit 800 con texto degradado estático (`background-clip: text`). Nav: Outfit 600, `0.75rem`, uppercase, `letter-spacing: .5px`; hover acento.
- **Profile hero**: avatar foto real 112px dentro de wrapper con `background: var(--accent-gradient); padding: 3px; border-radius: 50%; box-shadow: var(--shadow-card)` e imagen interior con `border: 3px solid #fff; border-radius: 50%` — réplica de la quote-card del portafolio. Layout flex actual se mantiene; móvil apilado centrado.
- **Tarjetas `.post-card`**: fondo `--surface`, radio 24px, sombra tarjeta, padding 1.5rem, separación 1rem entre tarjetas. Hover: `translateY(-4px)` + sombra azulada. Título Outfit 700; fecha y descripción en muted.
- **Tags píldora**: `background: rgba(4,107,210,.08)`, color acento, `padding: 4px 12px`, radio pill, `0.75rem/600`. Hover: relleno sólido `--accent-primary` + texto blanco.
- **`.featured-heading`**: Outfit 700 1.25rem con barra degradada debajo (`::after` 64×4px, radio 4px) — patrón `line-mf` del portafolio.
- **Prosa**: títulos Outfit; blockquote con borde izquierdo 3px acento + itálica + muted; `pre` fondo `#f1f5f9` radio 8px; `code` inline mismo fondo radio 6px; imágenes radio 16px; enlaces subrayados solo al hover.

### `src/components/ProfileHero.astro`
Sustituir el SVG placeholder por la foto real:

```astro
<div class="profile-avatar">
  <img src="/avatar.png" alt="" width="112" height="112" loading="eager" />
</div>
```

`alt=""` porque el nombre está adyacente como `<h1>` (el avatar es decorativo). El resto del componente no cambia.

### `src/layouts/BaseLayout.astro`
Añadir los 3 links de fuentes + `theme-color` en `<head>` (antes del cierre, tras los meta OG). Ningún otro cambio.

### Assets en `public/`
- **`avatar.png`** (nuevo): descarga de `https://miguelintech.com/img/1.png`.
- **`favicon.svg`**: recolorear a la nueva paleta (degradado #046bd2→#26b7cd), conservando la forma actual.
- **`og-default.png`**: regenerar 1200×630 con fondo degradado o sólido `#046bd2` (método: el que se usó originalmente / utilidad disponible; si no hay herramienta de degradado, sólido).

## Verificación

1. `npm run build` limpio, sin warnings.
2. Greps sobre `dist/index.html`: links de fuentes presentes, un `<h1>`, `class="profile-hero"` ×1, `<article class="post-card">` ×1 (con el flag actual), imagen `/avatar.png` presente.
3. Páginas internas intactas: `/blog/`, `/tags/`, post, 404 heredan los estilos automáticamente (9 páginas).
4. Contraste AA de todos los pares token documentados arriba.
5. Lighthouse ≥ 100 en Performance, SEO y Best Practices (regresión permitida solo si es por fuentes externas, nunca SEO/BP).
6. Rejilla visible pero sutil; sin ninguna animación nueva.

## Fuera de alcance

Modo oscuro · orbs/glassmorphism animados · botones (no existen) · enlaces sociales en footer · Tailwind · cambios de contenido o estructura de páginas.
