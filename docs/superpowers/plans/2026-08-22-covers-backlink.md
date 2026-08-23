# Covers, BackLink y Grid del Archivo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portada visual en cada tarjeta de post (imagen opcional + fallback degradado con inicial), enlace de regreso en páginas interiores, grid de 2 columnas en `/blog/` y píldoras de etiquetas sin enlace.

**Architecture:** Dos componentes nuevos pequeños (`PostCover`, `BackLink`) consumidos por las plantillas existentes; prop `wide` opcional en BaseLayout para ensanchar solo `/blog/`; todo el estilo vía tokens ya definidos en `global.css`.

**Tech Stack:** Astro 5, CSS vanilla con custom properties existentes, zod para el nuevo campo.

**Spec:** `docs/superpowers/specs/2026-08-22-covers-backlink-design.md`

**Rama:** `feat/post-covers-backlink` (crear en Task 1 desde `main`)

**Contexto crítico:** NO existen páginas `/tags/` (el usuario las eliminó en su commit `397b3f3`). Los enlaces `/tags/x/` actuales dan 404 y se limpian en Task 4. El sitio se construye con CSS inline (`inlineStylesheets: 'always'`), así que los greps de estilos van sobre el HTML.

---

### Task 1: Campo image + PostCover + integración en tarjetas

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/components/PostCover.astro`
- Modify: `src/components/PostCard.astro`
- Modify: `src/styles/global.css`
- Modify: `src/pages/index.astro`

- [ ] **Step 0: Crear rama**

Run: `git checkout -b feat/post-covers-backlink`
Expected: `Switched to a new branch 'feat/post-covers-backlink'`

- [ ] **Step 1: Añadir campo al esquema en `src/content.config.ts`**

Después de la línea `featured: z.boolean().default(false),` añadir:

```ts
    image: z.string().optional(),
```

- [ ] **Step 2: Crear `src/components/PostCover.astro`**

```astro
---
interface Props {
  title: string;
  image?: string;
}

const { title, image } = Astro.props;
---

{
  image ? (
    <img class="post-cover" src={image} alt="" width="640" height="360" loading="lazy" />
  ) : (
    <div class="post-cover cover-fallback" aria-hidden="true">
      <span>{title.charAt(0).toUpperCase()}</span>
    </div>
  )
}
```

- [ ] **Step 3: Reescribir `src/components/PostCard.astro`**

Contenido completo nuevo:

```astro
---
import type { CollectionEntry } from 'astro:content';
import { formattedDate } from '../utils/formattedDate';
import PostCover from './PostCover.astro';

interface Props {
  post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;
---

<article class="post-card">
  <PostCover title={post.data.title} image={post.data.image} />
  <time datetime={post.data.pubDate.toISOString()}>{formattedDate(post.data.pubDate)}</time>
  <h2><a href={`/blog/${post.id}/`}>{post.data.title}</a></h2>
  <p>{post.data.description}</p>
  {
    post.data.tags.length > 0 && (
      <ul class="tags">
        {post.data.tags.map((tag) => (
          <li><a href={`/tags/${tag}/`}>#{tag}</a></li>
        ))}
      </ul>
    )
  }
</article>
```

(Las píldoras siguen como `<a>` aquí; se cambian a `<span>` en Task 4.)

- [ ] **Step 4: Estilos de portada en `src/styles/global.css`**

4a. ELIMINAR esta línea:

```css
.post-card + .post-card { margin-top: 1rem; }
```

4b. INSERTAR después del bloque `@media (prefers-reduced-motion: reduce) { ... }`:

```css
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

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

- [ ] **Step 5: Envolver destacados en `src/pages/index.astro`**

Reemplazar `{posts.map((post) => <PostCard post={post} />)}` por:

```astro
    <div class="post-list">
      {posts.map((post) => <PostCard post={post} />)}
    </div>
```

- [ ] **Step 6: Verificar**

Run: `npm run build`
Expected: build exitoso, ≥5 páginas.

Run: `grep -o '<div class="post-cover cover-fallback"' dist/index.html | wc -l`
Expected: `1` (el post destacado usa fallback)

Run: `grep -o '<span>M</span>' dist/blog/index.html | wc -l`
Expected: `2` (ambos títulos empiezan con M)

- [ ] **Step 7: Commit**

```bash
git add src/content.config.ts src/components/PostCover.astro src/components/PostCard.astro src/styles/global.css src/pages/index.astro
git commit -m "feat: portadas en tarjetas con fallback de marca"
```

---

### Task 2: Grid de dos columnas en /blog/

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Prop `wide` en `src/layouts/BaseLayout.astro`**

1a. En `interface Props`, después de `title: string;` añadir:

```ts
  wide?: boolean;
```

1b. En la desestructuración, después de `title,` añadir:

```ts
  wide = false,
```

1c. Reemplazar `<main class="container">` por:

```astro
    <main class:list={['container', { 'container-wide': wide }]}>
```

- [ ] **Step 2: Reescribir `src/pages/blog/index.astro`**

Contenido completo nuevo:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';
import { SITE } from '../../consts';
import { getPublishedPosts } from '../../utils/posts';

const posts = await getPublishedPosts();
---

<BaseLayout title={`Todos los posts · ${SITE.title}`} description="Archivo completo de todos los posts del blog." wide>
  <h1>Todos los posts</h1>
  <div class="post-grid">
    {posts.map((post) => <PostCard post={post} />)}
  </div>
</BaseLayout>
```

- [ ] **Step 3: Estilos de grid en `src/styles/global.css`**

INSERTAR después del bloque `.post-list` añadido en Task 1:

```css
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

- [ ] **Step 4: Verificar**

Run: `npm run build`
Expected: exitoso.

Run: `grep -o 'class="container container-wide"' dist/blog/index.html | wc -l`
Expected: `1`

Run: `grep -o 'class="post-grid"' dist/blog/index.html | wc -l`
Expected: `1`

Run: `grep -o '<main class="container"' dist/index.html | wc -l`
Expected: `1` (la portada NO se ensancha; el Footer ya usa `class="container"`, por eso se acota al main)

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/blog/index.astro src/styles/global.css
git commit -m "feat: archivo de posts como grid de dos columnas"
```

---

### Task 3: BackLink en posts y archivo

**Files:**
- Create: `src/components/BackLink.astro`
- Modify: `src/pages/blog/[slug].astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Crear `src/components/BackLink.astro`**

```astro
---
interface Props {
  href: string;
  label: string;
}

const { href, label } = Astro.props;
---

<a class="back-link" href={href}>← {label}</a>
```

- [ ] **Step 2: Estilos en `src/styles/global.css`**

Añadir AL FINAL del archivo:

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

- [ ] **Step 3: Colocar en `src/pages/blog/index.astro`**

3a. Añadir al frontmatter:

```astro
import BackLink from '../../components/BackLink.astro';
```

3b. Antes de `<div class="post-grid">` insertar:

```astro
  <BackLink href="/" label="Inicio" />
```

- [ ] **Step 4: Colocar en `src/pages/blog/[slug].astro`**

4a. En el frontmatter, junto a los imports:

```astro
import BackLink from '../../components/BackLink.astro';
```

4b. Dentro de `<article>`, ANTES de `<header class="post-header">` insertar:

```astro
    <BackLink href="/blog/" label="Todos los posts" />
```

- [ ] **Step 5: Verificar**

Run: `npm run build`
Expected: exitoso.

Run: `grep -o '<a class="back-link" href="/">← Inicio</a>' dist/blog/index.html | wc -l`
Expected: `1`

Run: `grep -o '<a class="back-link" href="/blog/">← Todos los posts</a>' dist/blog/mi-primer-post/index.html | wc -l`
Expected: `1`

Run: `grep -c 'back-link' dist/index.html`
Expected: `0` (la portada no lleva)

- [ ] **Step 6: Commit**

```bash
git add src/components/BackLink.astro src/pages/blog/index.astro src/pages/blog/[slug].astro src/styles/global.css
git commit -m "feat: enlace de regreso en posts y archivo"
```

Nota zsh: citar la ruta con corchetes — `git add 'src/pages/blog/[slug].astro'`.

---

### Task 4: Píldoras de etiquetas sin enlace

**Files:**
- Modify: `src/components/PostCard.astro`
- Modify: `src/pages/blog/[slug].astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Cambiar `<a>` por `<span>` en `src/components/PostCard.astro`**

Reemplazar:

```astro
          <li><a href={`/tags/${tag}/`}>#{tag}</a></li>
```

por:

```astro
          <li><span>#{tag}</span></li>
```

- [ ] **Step 2: Igual en el header del post en `src/pages/blog/[slug].astro`**

Reemplazar:

```astro
        {post.data.tags.map((tag) => <li><a href={`/tags/${tag}/`}>#{tag}</a></li>)}
```

por:

```astro
        {post.data.tags.map((tag) => <li><span>#{tag}</span></li>)}
```

- [ ] **Step 3: CSS en `src/styles/global.css`**

Reemplazar estos dos bloques contiguos:

```css
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

por uno solo:

```css
.tags span {
  background: rgba(4, 107, 210, 0.08);
  color: var(--accent-primary);
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 600;
}
```

- [ ] **Step 4: Verificar**

Run: `npm run build`
Expected: exitoso, 5 páginas.

Run: `grep -rl 'href="/tags/' dist --include='*.html' | wc -l`
Expected: `0` (ningún enlace roto a tags)

Run: `grep -o '<span>#general</span>' dist/blog/mi-primer-post/index.html | wc -l`
Expected: `1` (solo las píldoras del header del post; PostCard no aparece en su propia página)

- [ ] **Step 5: Commit**

```bash
git add src/components/PostCard.astro 'src/pages/blog/[slug].astro' src/styles/global.css
git commit -m "feat: etiquetas como badges informativas sin enlace"
```

---

### Task 5: og:image por post + README

**Files:**
- Modify: `src/pages/blog/[slug].astro`
- Modify: `README.md`

- [ ] **Step 1: Pasar imagen al layout en `src/pages/blog/[slug].astro`**

En la llamada `<BaseLayout ...>` añadir después de la línea `description={post.data.description}`:

```astro
  image={post.data.image}
```

(Sin imagen, la prop es undefined y BaseLayout usa su default `/og-default.png`.)

- [ ] **Step 2: Documentar en `README.md`**

Después de la línea `featured: false                    # opcional: aparece en la portada` añadir:

```yaml
image: "/covers/mi-post.png"        # opcional: portada de la tarjeta
```

- [ ] **Step 3: Verificar**

Run: `npm run build && grep -o 'content="https://thoughts.miguelintech.com/og-default.png"' dist/blog/mi-primer-post/index.html | wc -l`
Expected: `1` (og:image default intacto)

- [ ] **Step 4: Commit**

```bash
git add 'src/pages/blog/[slug].astro' README.md
git commit -m "feat: imagen propia como og:image y documentación"
```

---

### Task 6: Verificación integral

**Files:** ninguno (solo verificación; arreglar con prefijo `fix:` si algo falla).

- [ ] **Step 1: Build limpio**

Run: `rm -rf .astro dist && npm run build`
Expected: 5 páginas, sin warnings.

- [ ] **Step 2: Batería de greps**

| Check | Comando | Esperado |
|---|---|---|
| Fallback portada home | `grep -o '<div class="post-cover cover-fallback"' dist/index.html \| wc -l` | `1` |
| Grid archivo | `grep -o 'repeat(2,1fr)' dist/blog/index.html \| wc -l` | `1` |
| BackLink archivo | `grep -o 'href="/">← Inicio</a>' dist/blog/index.html \| wc -l` | `1` |
| BackLink post | `grep -o 'href="/blog/">← Todos los posts</a>' dist/blog/mi-primer-post/index.html \| wc -l` | `1` |
| Sin enlaces tags | `grep -rl 'href="/tags/' dist --include='*.html' \| wc -l` | `0` |
| Pills span | `grep -o '<span>#general</span>' dist/index.html \| wc -l` | `1` |
| Un h1 por página | `grep -o '<h1>[^<]*</h1>' dist/blog/index.html` | `<h1>Todos los posts</h1>` |

- [ ] **Step 3: Prueba temporal con image real**

Añadir temporalmente `image: "/avatar.png"` al frontmatter de `src/content/blog/markdown-y-seo.md` (después de `tags`). Build:

Run: `npm run build && grep -o '<img class="post-cover" src="/avatar.png"' dist/blog/index.html | wc -l`
Expected: `1`

Run: `grep -o 'og:image" content="[^"]*avatar.png"' dist/blog/markdown-y-seo/index.html | wc -l`
Expected: `1`

REVERTIR el cambio (`git checkout -- src/content/blog/markdown-y-seo.md`) y reconstruir: `npm run build`.

- [ ] **Step 4: Lighthouse (si hay Chrome)**

```bash
npm run preview &
sleep 3
npx --yes lighthouse http://localhost:4321/blog/ --quiet --chromeFlags="--headless=new" --onlyCategories=performance,seo,best-practices 2>&1 | tail -15
kill %1
```
Esperado: SEO 100, BP 100, Performance ≥90 (fuentes externas permitidas). Omitir sin bloquear si no hay Chrome.

- [ ] **Reporte final**

Sin cambios que commitear si todo pasa; arreglos con prefijo `fix:`.

---

## Auto-revisión del plan (hecha al escribirlo)

- **Cobertura del spec:** campo image (T1), PostCover fallback (T1), tarjetas con portada (T1), post-list reemplaza hermano (T1), grid+wide (T2), BackLink componente/CSS/placement posts+archivo (T3), pills sin enlace en tarjeta y post + CSS (T4), og:image por post (T5), README (T5), verificación completa incluida prueba con imagen real y revert (T6). Home sin backlink y sin grid según decisiones. ✔
- **Placeholders:** ninguno; todos los pasos tienen código/comando exactos. ✔
- **Consistencia:** nombres de props/clases coherentes entre tareas (`image`, `wide`, `post-cover`, `cover-fallback`, `post-list`, `post-grid`, `container-wide`, `back-link`); rutas con corchetes citadas para zsh; conteo de pills del post ajustado a lo que realmente renderiza cada página. ✔
