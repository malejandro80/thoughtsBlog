# Thoughts — thoughts.miguelintech.com

Blog personal en Markdown hecho con [Astro](https://astro.build), desplegado en GitHub Pages con foco en SEO.

## Escribir un post

Crea un archivo en `src/content/blog/mi-post.md`:

```yaml
---
title: "Título del post"           # obligatorio
description: "Resumen para buscadores" # obligatorio
pubDate: 2026-08-22                # obligatorio
updatedDate: 2026-08-23            # opcional
tags: ["astro", "seo"]             # opcional (minúsculas, sin espacios)
draft: true                        # opcional: no se publica en producción
---

Contenido en Markdown...
```

El frontmatter se valida al compilar: si falta título o descripción, el build falla.

## Comandos

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo en localhost:4321 |
| `npm run build` | Compila el sitio a `dist/` |
| `npm run preview` | Sirve `dist/` localmente |

## Deploy

Automático: cada push a `main` ejecuta el workflow `.github/workflows/deploy.yml` y publica en GitHub Pages con el dominio `thoughts.miguelintech.com` (archivo `public/CNAME`).

## SEO incluido

Títulos y descripciones únicos, URLs canónicas, Open Graph/Twitter Cards, JSON-LD BlogPosting, `sitemap.xml`, `rss.xml`, `robots.txt`, HTML semántico y cero JavaScript en cliente.
