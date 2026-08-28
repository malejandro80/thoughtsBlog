# Dark Mode Design Spec

## Overview

Add dark mode support to the thoughtsBlog Astro site using separate CSS files for each theme. The user can switch via a toggle button; the site also respects the OS `prefers-color-scheme` setting. Choice is persisted in `localStorage`.

## Approach

Separate CSS files per theme, swapped via `<link>` tag href. An inline `<script>` in `<head>` reads preference before paint to prevent FOUC.

## File Structure

```
src/styles/
  global.css        ← All layout/component styles (no color variables)
  theme-light.css   ← Light mode :root variable definitions
  theme-dark.css    ← Dark mode :root variable definitions
```

## Implementation Details

### 1. Split CSS variables from `global.css`

**`theme-light.css`** — contains only `:root { ... }` with current light palette:

```css
:root {
  --bg: #f8fafc;
  --surface: #ffffff;
  --surface-muted: #f1f5f9;
  --text: #0f172a;
  --muted: #64748b;
  --accent-primary: #046bd2;
  --accent-secondary: #26b7cd;
  --accent-gradient: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  --border: #e2e8f0;
  --chrome-bg: rgba(255, 255, 255, 0.85);
  /* ... alias variables ... */
}
```

**`theme-dark.css`** — overrides with dark palette:

```css
:root {
  --bg: #0f172a;
  --surface: #1e293b;
  --surface-muted: #334155;
  --text: #f1f5f9;
  --muted: #94a3b8;
  --accent-primary: #3b82f6;
  --accent-secondary: #22d3ee;
  --accent-gradient: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  --border: #334155;
  --chrome-bg: rgba(15, 23, 42, 0.85);
  /* ... alias variables ... */
}
```

**`global.css`** — retains all current styles but with the `:root` color block removed. Layout, typography, component styles remain unchanged (they already reference `var(--bg)`, `var(--text)`, etc.).

### 2. `BaseLayout.astro` changes

In `<head>`:

- Inline `<style>` tag containing the no-FOUC script logic (sets `data-theme` attribute and correct `<link>` href before paint)
- `<link rel="stylesheet" id="theme-css" href="/theme-light.css" />` — default to light
- Inline `<script>` that:
  1. Reads `localStorage.getItem('theme')`
  2. Falls back to `matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'`
  3. Sets `document.documentElement.dataset.theme = theme`
  4. Updates `document.getElementById('theme-css').href = '/theme-${theme}.css'`

### 3. Toggle button in `Header.astro`

- Add a `<button>` with sun/moon SVG icon next to the navigation
- Styled as a small, unobtrusive icon button
- On click:
  1. Toggle `data-theme` between `light` and `dark`
  2. Swap `<link>` href to matching theme file
  3. Save choice to `localStorage.setItem('theme', newTheme)`
  4. Update button icon (sun for light mode, moon for dark mode)

### 4. Meta theme-color

Update `<meta name="theme-color">` dynamically via JS to match the current theme background:
- Light: `#f8fafc`
- Dark: `#0f172a`

### 5. Grid overlay adjustment

The `body::before` subtle grid uses hardcoded `rgba(4, 107, 210, 0.03)` — adjust opacity for dark mode to remain subtle against dark background (e.g., `rgba(59, 130, 246, 0.05)`).

### 6. Footer glow adjustment

The `.site-footer::before` radial gradient uses light-mode-friendly opacities. Slightly reduce opacity in dark mode for readability.

## Dark Mode Palette

| Token | Light | Dark |
|-------|-------|------|
| `--bg` | `#f8fafc` | `#0f172a` |
| `--surface` | `#ffffff` | `#1e293b` |
| `--surface-muted` | `#f1f5f9` | `#334155` |
| `--text` | `#0f172a` | `#f1f5f9` |
| `--muted` | `#64748b` | `#94a3b8` |
| `--accent-primary` | `#046bd2` | `#3b82f6` |
| `--accent-secondary` | `#26b7cd` | `#22d3ee` |
| `--border` | `#e2e8f0` | `#334155` |
| `--chrome-bg` | `rgba(255,255,255,0.85)` | `rgba(15,23,42,0.85)` |

## Files to Modify

1. **New:** `src/styles/theme-light.css`
2. **New:** `src/styles/theme-dark.css`
3. **Modified:** `src/styles/global.css` — remove `:root` color block, add dark-mode overrides for grid overlay and footer glow
4. **Modified:** `src/layouts/BaseLayout.astro` — add theme `<link>`, inline init script, meta theme-color update
5. **Modified:** `src/components/Header.astro` — add toggle button with icon

## Accessibility

- Toggle button has `aria-label` for screen readers
- Button uses `aria-pressed` to indicate current state
- Sun/moon icons have `aria-hidden="true"` (label on button is sufficient)
- Color contrast ratios maintained in both themes (WCAG AA)

## Testing

- Toggle switches theme instantly without page reload
- Refreshing page preserves chosen theme
- OS preference respected on first visit (no localStorage set)
- No flash of wrong theme on page load
- Toggle button accessible via keyboard (Tab + Enter/Space)
- Both themes maintain readable contrast
