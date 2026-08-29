# GTM Tracking Design

Date: 2026-08-29
Status: Approved

## Goal

Track with Google Tag Manager (GTM) that is configured in the site to measure:

1. How many people view the main page (`/` and `/en/`)
2. Which posts are most read
3. How many times people click the "see my portfolio" nav link

## Constraints

- Static Astro 5 site, no backend, no accounts/auth.
- No analytics library installed today; GTM is loaded directly via its standard container snippet.
- i18n locales `es` (default, no prefix) and `en` (prefixed with `/en/`).
- Container ID: `GTM-MQ8M3STF`.

## Architecture

- GTM container snippet (JS in `<head>`, `<noscript>` fallback in `<body>`) is added once in `src/layouts/BaseLayout.astro`, so it loads on every page in both locales.
- Custom events are pushed to the global `dataLayer` array.
- No new dependencies. All tracking is client-side via scripts managed by GTM.

## Events

| Goal                  | Event            | Fields                                                     | Fired                                      |
|-----------------------|------------------|------------------------------------------------------------|--------------------------------------------|
| Home page views       | standard pageview| —                                                          | GTM "All Pages" trigger, filter `Page Path` = `/` or `/en/` |
| Most-read posts       | `post_view`      | `post_slug`, `post_title`                                  | article page load                          |
| Portfolio clicks      | `portfolio_click`| `nav_label: 'portfolio'`                                   | click on Portfolio nav link                |

## Implementation

1. `src/layouts/BaseLayout.astro`
   - Add GTM loader in `<head>`: `(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-MQ8M3STF');`
   - Add `<noscript><iframe ... GTM-MQ8M3STF ...></iframe></noscript>` just inside `<body>`.
   - Accept an optional `analytics` prop of shape `{ event: string; data: Record<string, unknown> }`.
   - When `analytics` is set, render an inline `<script is:inline>` that pushes `window.dataLayer.push({ event, ...data })`. The push values are serialized statically at build time via `JSON.stringify` on the frontmatter object.
   - Ensure `dataLayer` is initialized before the push runs (the GTM loader creates `window.dataLayer`).

2. `src/pages/blog/[slug].astro` and `src/pages/en/blog/[slug].astro`
   - Pass `analytics={{ event: 'post_view', data: { post_slug: slug, post_title: post.data.title } }}` to `BaseLayout`.

3. `src/components/SiteNav.astro`
   - Add an inline `<script is:inline>` with a click listener on the portfolio link (class `nav-link`, `href` = `SITE.portfolio`).
   - On click push `dataLayer.push({ event: 'portfolio_click', nav_label: 'portfolio' })`.
   - Guard the listener so it only attaches when `window.dataLayer` exists.

## GTM-side configuration (manual, done by owner in container)

- GA4 config tag triggered on All Pages for pageview reporting.
- Custom event tag(s) for `post_view` and `portfolio_click` (e.g., send to GA4 event).
- Home page "main page views" are read from the GA4 page path dimension filtered to `/` and `/en/`.

## Error Handling

- No backend calls; if GTM is blocked or fails to load, the site is unaffected (scripts are non-blocking, inline pushes are guard-empty).
- `dataLayer` is created by GTM loader before any event push; inline pushes run after load in normal flow.

## Testing / Verification

- No test framework exists in this repo. Verification is manual:
  - `npm run build` succeeds.
  - Built HTML for home, blog, and article pages contains the container ID `GTM-MQ8M3STF`.
  - Article pages contain `dataLayer.push` with `post_view`/`post_slug`/`post_title`.
  - `SiteNav.astro` output contains `portfolio_click`.
- Optional runtime check via browser devtools: verify `dataLayer` on page load and a `post_view` push on article pages.

## Out of Scope

- Post card click tracking.
- Scroll depth tracking.
- Server-side analytics.