# Covers de post, botón de regresar y grid del archivo

**Fecha:** 2026-08-22 · **Estado:** aprobado por el usuario

## Objetivo

1. Botón/enlace de regreso en todas las páginas interiores del blog.
2. Portada visual en cada tarjeta de post: imagen opcional por frontmatter con fallback de marca generado en CSS.
3. Archivo `/blog/` como grid de 2 columnas.
4. Limpieza derivada: el usuario eliminó las páginas `/tags/` en su commit `397b3f3`; las píldoras `#tag` que quedaban enlazando ahí pasan a ser badges informativas sin enlace.

## Decisiones previas (acordadas)

1. **Regresar:** en posts → `/blog/` ("Todos los posts"); en `/blog/` → `/` ("Inicio"). La home es la raíz, no lleva botón; las páginas de tags ya no existen.
2. **Imágenes:** campo opcional `image`; sin él, la tarjeta muestra un degradado de marca con la inicial del título (mismo vocabulario visual que avatar/favicon).
3. **Layout:** grid de 2 columnas en `/blog/` (≥640px, contenedor ensanchado); portada y tarjetas apiladas se quedan como están pero también mostrarán la portada visual.
4. **Etiquetas:** pills visibles sin enlace (`<span>`), tanto en tarjetas como en cabecera de post. Siguen siendo keywords para SEO/JSON-LD.

## Cambios

### `src/content.config.ts` — campo opcional
Añadir al schema del blog: `image: z.string().optional()` (ruta absoluta servida desde `public/`, p. ej. `/covers/mi-post.png`).

### `src/components/PostCover.astro` — nuevo
Props: `title: string`, `image?: string`. Renderiza:

```astro
{image ? (
  <img class="post-cover" src={image} alt="" width="640" height="360" loading="lazy" />
) : (
  <div class="post-cover cover-fallback" aria-hidden="true">
    <span>{title.charAt(0).toUpperCase()}</span>
  </div>
)}
```

`alt=""`: decorativa, el título real está en el enlace de abajo. Fallback con inicial blanca Outfit 800 sobre `--accent-gradient`.

### `src/components/BackLink.astro` — nuevo
Props: `href`, `label`. Markup:

```astro
<a class="back-link" href={href}>← {label}</a>
```

### `src/components/PostCard.astro`
- Añadir `<PostCover title={post.data.title} image={post.data.image} />` como primer hijo del `<article>`.
- Píldoras sin enlace: `#{tag}` pasa de `<a href>` a `<span>`.
- El resto (time, h2, descripción) sin cambios.

### `src/pages/blog/[slug].astro`
- `<BackLink href="/blog/" label="Todos los posts" />` arriba del `<article>`, antes del `<header>`.
- Píldoras del header del post → `<span>` (sin enlace).
- Bonus SEO: `image={post.data.image}` en BaseLayout para og/twitter:image cuando el post tenga imagen propia (BaseLayout ya resuelve rutas absolutas; sin imagen sigue `/og-default.png`).

### `src/pages/blog/index.astro`
- `<BackLink href="/" label="Inicio" />` antes del listado.
- Envolver los posts en `<div class="post-grid">`.

### `src/layouts/BaseLayout.astro` — contenedor ancho
Nueva prop opcional `wide?: boolean`; `<main class:list={['container', { 'container-wide': wide }]}>`. `/blog/` la usa (`wide`), el resto queda igual.

### `README.md`
Documentar `image` en el ejemplo YAML de "Escribir un post", después de `featured`:

```yaml
image: "/covers/mi-post.png"        # opcional: portada de la tarjeta
```

## Estilos nuevos (`src/styles/global.css`)

```css
/* Portada de tarjeta: sangra sobre el padding de la tarjeta */
.post-cover {
  margin: -1.5rem -1.5rem 1rem;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.cover-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-gradient);
}

.cover-fallback span {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 4rem;
  color: #fff;
}
```

```css
/* Listados: reemplaza al selector hermano .post-card + .post-card */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .post-grid { grid-template-columns: repeat(2, 1fr); }
}

.container-wide { max-width: 56rem; }
```

La regla `.post-card + .post-card { margin-top: 1rem; }` se ELIMINA (frágil e incompatible con grid); la sección destacada de la portada pasa a usar `<div class="post-list">`.

```css
.back-link {
  display: inline-block;
  margin-block: 1.25rem 0;
  font-family: var(--font-heading);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--muted);
}

.back-link:hover { color: var(--accent-primary); }
```

Píldoras: los selectores `.tags a` y su hover se sustituyen por `.tags span` con el mismo estilo visual (fondo `rgba(4,107,210,.08)`, color acento, `padding: 4px 12px`, radio pill, `0.75rem/600`); sin reglas de hover ni transición (no son clicables).

## Fuera de alcance

Restaurar páginas de tags · generar PNG de fallback por post · usar el fallback como og:image individual (sigue `og-default.png`) · botón en la home o 404 · cambiar la portada.

## Verificación

1. Build limpio, ≥5 páginas (sin tags).
2. `dist/blog/index.html`: BackLink a `/`, grid de 2 columnas en CSS inline, 2 tarjetas con portada (fallbacks con iniciales M y M — ambos títulos empiezan con M).
3. Un post cualquiera: BackLink a `/blog/`, pills como `<span>` sin `<a>`, cero enlaces internos rotos a `/tags/`.
4. Con `image:` definido en un post de prueba temporal: `<img class="post-cover">` presente y og:image apunta a esa ruta (se revierte tras la prueba).
5. Ningún `<a href="/tags/...">` en ningún HTML generado.
6. Contraste AA intacto; Lighthouse SEO/BP en 100.
