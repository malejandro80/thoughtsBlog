# Diseño: Página principal personal con posts destacados

Fecha: 2026-08-22
Estado: Aprobado por el usuario
Base: docs/superpowers/specs/2026-08-22-astro-blog-design.md (diseño del blog original)

## Objetivo

Convertir la home del blog en una página de presentación personal: nombre como título, foto (placeholder por ahora), descripción y una sección de posts relevantes seleccionados manualmente.

## Decisiones

| Decisión | Elección |
|---|---|
| Selección de destacados | Flag `featured: true` en el frontmatter de cada post |
| Fallback sin destacados | Últimos 3 posts publicados |
| Foto | Placeholder SVG con iniciales "M" (reemplazable por foto real después) |
| Nombre (h1) | "Miguel Bastidas" |
| Descripción | Se reutiliza `SITE.description` existente |

Nota: `SITE.author` en `src/consts.ts` cambia de `'Miguel'` a `'Miguel Bastidas'` para que el nombre sea consistente en h1, footer y title de la home.

## Arquitectura

### 1. Esquema (`src/content.config.ts`)

Nuevo campo opcional en el schema zod del blog:

```ts
featured: z.boolean().default(false),
```

### 2. Utilidad (`src/utils/posts.ts`)

Nueva función exportada:

```ts
export async function getFeaturedPosts(limit = 3): Promise<CollectionEntry<'blog'>[]>
```

- Toma los posts publicados (`getPublishedPosts()`), filtra `data.featured`, ordena por fecha descendente y limita a `limit`.
- Si el resultado es vacío, devuelve los primeros `limit` de `getPublishedPosts()` (los más recientes). La sección nunca queda vacía.

### 3. Componente (`src/components/ProfileHero.astro`)

- Layout flex: avatar a la izquierda, texto a la derecha; apilado y centrado en móvil.
- Avatar: SVG inline placeholder — círculo azul (#1d4ed8) con iniciales "M", mismo lenguaje visual que el favicon. Se reemplaza por `<img>` cuando haya foto real.
- Contenido: `<h1>Miguel Bastidas</h1>` (desde `SITE.author`) + `<p>{SITE.description}</p>`.
- Sin props: lee directamente de `SITE`.

### 4. Home (`src/pages/index.astro`)

- El hero actual ("Thoughts") se reemplaza por `<ProfileHero />`.
- La sección de posts pasa a titularse "Posts destacados" (`<h2>`) y consume `getFeaturedPosts()` renderizando cada uno con el `PostCard` existente.
- Se mantiene el enlace "Ver todos los posts →" a `/blog/`.

## SEO

- `<title>` de la home: `Miguel Bastidas · Thoughts` (antes `Thoughts`).
- `<h1>` de la home pasa a ser el nombre personal.
- Resto de metadatos (description, canonical, OG, Twitter, JSON-LD) sin cambios.

## Manejo de errores

- `featured` validado por zod (boolean con default false); un valor inválido rompe el build igual que el resto del frontmatter.
- Sin casos nuevos de error en runtime: el fallback garantiza contenido en la sección.

## Verificación

1. Marcar un post de ejemplo con `featured: true` → build → aparece primero en la home.
2. Quitar el flag → build → la sección muestra los últimos 3 publicados (fallback).
3. Grep del HTML generado: `<h1>Miguel Bastidas</h1>`, `<title>Miguel Bastidas · Thoughts</title>` y presencia de la sección de destacados.
