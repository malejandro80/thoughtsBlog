# Diseño: Blog de pensamientos en Markdown con foco en SEO

Fecha: 2026-08-22
Estado: Aprobado por el usuario

## Objetivo

Blog personal escrito en Markdown, optimizado para SEO y posicionamiento orgánico, desplegado en GitHub Pages con dominio propio.

## Decisiones de tecnología

| Decisión | Elección | Motivo |
|---|---|---|
| Framework | Astro (SSG, sin JS en cliente) | HTML estático puro → Core Web Vitals óptimos |
| Contenido | Content Collections (`src/content/blog/*.md`) | Validación de frontmatter en build |
| Hosting | GitHub Pages (GitHub Actions) | Gratis, deploy automático desde Git |
| Dominio | `thoughts.miguelintech.com` vía archivo `CNAME` | Mejor branding y SEO a largo plazo |

Alternativas descartadas: AstroPaper (tema con código ajeno y features no solicitadas), Next.js (innecesario para blog estático), Eleventy (Astro preferido por el usuario).

## Arquitectura

- Sitio 100% estático: `astro build` genera HTML en `dist/`.
- Los posts se escriben como `.md` en `src/content/blog/`. El esquema valida el frontmatter al compilar: es imposible publicar un post sin título ni descripción.
- Cero JavaScript en cliente por defecto. Sin trackers ni frameworks de UI.
- Deploy: push a `main` → GitHub Actions ejecuta build → publica `dist/` en GitHub Pages.

## Estructura del proyecto

```
src/
  content.config.ts        # esquema zod del frontmatter
  content/blog/            # posts .md
  layouts/BaseLayout.astro # <head> completo: meta SEO, OG, JSON-LD
  components/              # Header, Footer, PostCard
  styles/global.css
  pages/
    index.astro            # home: lista de posts ordenada por fecha
    blog/index.astro       # archivo completo de posts
    blog/[slug].astro      # post individual
    tags/index.astro       # índice de etiquetas
    tags/[tag].astro       # posts por etiqueta
    rss.xml.ts             # feed RSS
    robots.txt.ts          # permite todo + referencia al sitemap
    404.astro
public/
  CNAME                    # dominio propio
  favicon.svg
  og-default.png           # imagen OG por defecto
.github/workflows/deploy.yml
```

## Requisitos SEO

Cada página genera:

1. `<title>` único y `<meta name="description">` derivados del frontmatter.
2. `<link rel="canonical">` con la URL absoluta (`site: "https://thoughts.miguelintech.com"` en `astro.config.mjs`).
3. Open Graph (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`) y Twitter Cards.
4. JSON-LD `BlogPosting` en cada post (autor, fecha, imagen).
5. HTML semántico: `<article>`, un único `<h1>` por página, `<time datetime>` en fechas.
6. `sitemap.xml` (integración `@astrojs/sitemap`) y `rss.xml` (`@astrojs/rss`).
7. `robots.txt` que apunta al sitemap.

## Esquema de frontmatter

```yaml
title: string        # requerido
description: string  # requerido
pubDate: date        # requerido
updatedDate: date    # opcional
tags: string[]       # opcional
draft: boolean       # opcional (default false); excluye del build
```

Los drafts se filtran en producción pero son visibles con `astro dev`.

## Flujo de datos

1. Autor crea `src/content/blog/mi-post.md` con el frontmatter validado.
2. En build: Content Collections validan el frontmatter; las páginas consultan `getCollection("blog")` filtrando drafts.
3. Astro genera HTML estático + sitemap + RSS.
4. GitHub Actions despliega `dist/` a Pages.

## Manejo de errores

- Frontmatter inválido → el build falla indicando archivo y campo erróneo (comportamiento deseado: no se publica contenido sin metadatos).
- Rutas inexistentes → `404.astro`.

## Verificación

1. `npm run build` sin errores.
2. Inspeccionar `dist/sitemap-index.xml`, `dist/rss.xml` y robots.txt generados.
3. Comprobar metadatos (canonical, OG, JSON-LD) en el HTML de un post.
4. Lighthouse local: objetivo ≥ 95 en SEO y Performance.
5. Deploy correcto en GitHub Pages con dominio propio respondiendo por HTTPS.
