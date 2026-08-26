# Footnote Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Footnote component to display a styled note at the end of each blog post.

**Architecture:** Simple Astro component with optional text prop and default value. Styles use existing CSS variables for consistency.

**Tech Stack:** Astro, CSS custom properties

---

## File Structure

- **Create:** `src/components/Footnote.astro` — Standalone component with prop interface
- **Modify:** `src/pages/blog/[slug].astro` — Import and render Footnote after post content

---

### Task 1: Create Footnote Component

**Files:**
- Create: `src/components/Footnote.astro`

- [ ] **Step 1: Create the Footnote component file**

```astro
---
// src/components/Footnote.astro
interface Props {
  text?: string;
}

const { text = "Texto por defecto del pie de nota" } = Astro.props;
---

<aside class="footnote">
  <p>{text}</p>
</aside>

<style>
  .footnote {
    margin-top: 2rem;
    padding: 1rem 1.25rem;
    background: var(--surface-muted);
    border-left: 3px solid var(--accent-primary);
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    color: var(--muted);
  }
  .footnote p {
    margin: 0;
  }
</style>
```

- [ ] **Step 2: Verify component compiles**

Run: `npm run build`
Expected: Build succeeds without errors

---

### Task 2: Integrate Footnote into Post Layout

**Files:**
- Modify: `src/pages/blog/[slug].astro:1-8,50-76`

- [ ] **Step 1: Import Footnote component**

Add to imports section (after line 8):

```astro
import Footnote from '../../components/Footnote.astro';
```

- [ ] **Step 2: Add Footnote after post content**

Replace lines 73-76 with:

```astro
    <div class="prose">
      <Content />
    </div>
    <Footnote />
  </article>
</BaseLayout>
```

- [ ] **Step 3: Verify integration**

Run: `npm run dev`
Navigate to any blog post and verify the footnote appears at the bottom with default text.

- [ ] **Step 4: Test custom text prop**

In `src/pages/blog/[slug].astro`, change line 76 to:

```astro
<Footnote text="Texto personalizado de ejemplo" />
```

Run: `npm run dev`
Verify the custom text appears in the footnote.

- [ ] **Step 5: Revert to default**

Change line 76 back to:

```astro
<Footnote />
```

- [ ] **Step 6: Commit changes**

```bash
git add src/components/Footnote.astro src/pages/blog/[slug].astro
git commit -m "feat: add Footnote component for blog posts"
```

---

## Verification

After completing both tasks:

1. Run `npm run build` — should complete without errors
2. Run `npm run dev` — navigate to `/blog/` and open any post
3. Verify footnote appears at the bottom of the post content with the default text
4. Check that the footnote has the correct styling: muted background, blue left border, rounded corners
