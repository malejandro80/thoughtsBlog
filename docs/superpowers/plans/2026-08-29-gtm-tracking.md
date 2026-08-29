# GTM Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Google Tag Manager tracking to measure home page views, most-read posts, and portfolio link clicks on the static Astro blog.

**Architecture:** Loads the `GTM-MQ8M3STF` container in the shared `BaseLayout.astro`, pushes `post_view` events on article pages via an `analytics` prop, and pushes `portfolio_click` events from a click listener on the portfolio nav link. All tracking is client-side via the global `dataLayer`; GTM tags are configured manually in the container.

**Tech Stack:** Astro 5, vanilla JavaScript (no new dependencies).

---

### Task 1: Add GTM container to BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

The layout is the single wrapper for every page in both locales. Adding the container here guarantees GTM loads everywhere.

- [ ] **Step 1: Add `analytics` prop and GTM loader**

In `src/layouts/BaseLayout.astro`:

1. Extend the `Props` interface to accept an optional analytics payload:

```ts
interface Props {
  title: string;
  wide?: boolean;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: Date;
  modifiedTime?: Date;
  tags?: string[];
  jsonLd?: Record<string, unknown>;
  analytics?: { event: string; data: Record<string, unknown> };
}
```

2. Destructure it in the frontmatter (add to the existing destructuring block):

```ts
const {
  title,
  wide = false,
  description,
  image = '/og-default.png',
  type = 'website',
  publishedTime,
  modifiedTime,
  tags = [],
  jsonLd,
  analytics,
} = Astro.props;
```

3. Add the GTM loader script to `<head>`, right before the theme script (before line 51 ` <script is:inline>`):

```html
<script is:inline>
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0];
    var j = d.createElement(s);
    var dl = l !== 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', 'GTM-MQ8M3STF');
</script>
```

4. Add the `<noscript>` fallback right after the `<body>` opening tag (line 98, after `<body>`):

```html
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MQ8M3STF" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

5. Add the `analytics` event push script right before the closing `</body>` tag (line 104, after `<Footer />`):

```astro
{analytics && (
  <script is:inline set:html={`
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(${JSON.stringify({ event: analytics.event, ...analytics.data }).replace(/</g, '\\u003c')});
  `} />
)}
```

Note: the `.replace(/</g, '\\u003c')` escapes any `<` in the payload (e.g. a title containing `</script>`), mirroring the existing jsonLd script in the same file.

- [ ] **Step 2: Build to verify the container loads**

```bash
npm run build
```

Expected: build succeeds with no errors. Then verify the container is in the built output:

```bash
rg -l "GTM-MQ8M3STF" dist/
```

Expected: at least `dist/index.html` (home) and `dist/blog/index.html` listed.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(analytics): add GTM container to BaseLayout"
```

---

### Task 2: Push `post_view` on article pages

**Files:**
- Modify: `src/pages/blog/[slug].astro`
- Modify: `src/pages/en/blog/[slug].astro`

Both article route files are nearly identical (locale and path prefixes differ). Each passes an `analytics` prop so `BaseLayout` emits the `post_view` event with slug + title.

- [ ] **Step 1: Pass `analytics` prop to BaseLayout in `src/pages/blog/[slug].astro`**

In the `<BaseLayout ...>` tag (lines 45-54), add the prop after `jsonLd={jsonLd}`:

```astro
  jsonLd={jsonLd}
  analytics={{
    event: 'post_view',
    data: { post_slug: slug, post_title: post.data.title },
  }}
>
```

(Replace the existing line `  jsonLd={jsonLd}` + `>` with the block above.)

- [ ] **Step 2: Pass `analytics` prop to BaseLayout in `src/pages/en/blog/[slug].astro`**

Same edit in `src/pages/en/blog/[slug].astro` (its BaseLayout tag is lines 45-54 too):

```astro
  jsonLd={jsonLd}
  analytics={{
    event: 'post_view',
    data: { post_slug: slug, post_title: post.data.title },
  }}
>
```

- [ ] **Step 3: Build and verify the event is present**

```bash
npm run build
```

Expected: build succeeds. Verify the push is in every article page:

```bash
rg -l "post_view" dist/ | sort
```

Expected: one file per article for each locale, e.g. `dist/blog/governance/index.html` (does not exist today) and `dist/en/blog/reflections-on-governance/index.html`. If there are 2 articles total (one per locale), expect exactly 2 files matching.

Also verify `post_slug` and `post_title` appear:

```bash
rg "post_slug" dist/
```

Expected: matches containing `"post_slug"` and `"post_title"`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/\[slug\].astro src/pages/en/blog/\[slug\].astro
git commit -m "feat(analytics): push post_view event on article pages"
```

---

### Task 3: Push `portfolio_click` on portfolio nav link

**Files:**
- Modify: `src/components/SiteNav.astro`

The portfolio link is the only external nav link pointing to `https://miguelintech.com/` (in `src/consts.ts` as `SITE.portfolio`). We attach a click listener that pushes `portfolio_click`.

- [ ] **Step 1: Add id to portfolio link**

In `src/components/SiteNav.astro`, add `id="portfolio-link"` to the portfolio anchor (line 28):

```astro
  <a id="portfolio-link" class="nav-link" href="https://miguelintech.com/">{locale === 'en' ? 'Portfolio' : 'Portafolio'}</a>
```

- [ ] **Step 2: Add click listener script**

Append at the end of `src/components/SiteNav.astro` (after the `</nav>` on line 15), while still inside the component's template (it can live after `</nav>`):

```astro
<script is:inline>
  (function () {
    var d = window.dataLayer || (window.dataLayer = []);
    var link = document.getElementById('portfolio-link');
    if (link) {
      link.addEventListener('click', function () {
        d.push({ event: 'portfolio_click', nav_label: 'portfolio' });
      });
    }
  })();
</script>
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Expected: build succeeds. Verify the listener is present in all pages that render SiteNav:

```bash
rg -l "portfolio_click" dist/ | sort
```

Expected: home (es/en) and blog listing (es/en) pages, at minimum `dist/index.html` and `dist/en/index.html`.

- [ ] **Step 4: Commit**

```bash
git add src/components/SiteNav.astro
git commit -m "feat(analytics): push portfolio_click event on portfolio nav link"
```

---

### Task 4: Final verification

**Files:**
- None (read-only checks)

- [ ] **Step 1: Confirm all events present in built output**

```bash
npm run build && echo "--- GTM container ---" && rg -c "GTM-MQ8M3STF" dist/index.html && echo "--- post_view on article pages ---" && rg -l "post_view" dist/ | sort && echo "--- portfolio_click ---" && rg -l "portfolio_click" dist/ | sort
```

Expected:
- `GTM-MQ8M3STF` appears at least twice in `dist/index.html` (loader + noscript iframe).
- `post_view` files: one per article per locale.
- `portfolio_click` files: home + blog pages in both locales.

- [ ] **Step 2: Sanity-check no stray dataLayer code on pages that shouldn't have it**

```bash
rg -l "post_view" dist/ | wc -l
```

Expected: equals the number of article pages (2 if one ES + one EN article, adjust for actual content).

- [ ] **Step 3: Final commit of any lint/format fixes**

If the build reported warnings or formatting issues, fix them and commit. Otherwise nothing to do.

**No further steps.** GTM tags and GA4 reporting configuration happen manually in the container by the owner (out of scope for this repo).