# Diseño: Componente Footnote

## Resumen

Crear un componente `Footnote.astro` para mostrar un pie de nota al final de cada post, con un texto opcional que tiene valor por defecto.

## Contexto

- **Proyecto**: Blog personal con Astro
- **Ubicación**: `src/components/Footnote.astro`
- **Uso**: Se insertará en `src/pages/blog/[slug].astro` después del contenido del post

## Especificación

### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `text` | `string` | No | Texto del pie de nota. Valor por defecto: "Texto por defecto del pie de nota" |

### Estilo visual

- **Fondo**: `var(--surface-muted)` (#f1f5f9)
- **Borde izquierdo**: 3px sólido `var(--accent-primary)` (#046bd2)
- **Borde redondeado**: `var(--radius-sm)` (8px)
- **Tipografía**: `font-size: 0.9rem`, color `var(--muted)` (#64748b)
- **Espaciado**: `margin-top: 2rem`, `padding: 1rem 1.25rem`

### Implementación

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

### Uso

En `src/pages/blog/[slug].astro`, agregar después de `<div class="prose">`:

```astro
<div class="prose">
  <Content />
</div>
<Footnote text="Texto personalizado del post" />
```

## Archivos a modificar

1. **Crear**: `src/components/Footnote.astro`
2. **Modificar**: `src/pages/blog/[slug].astro` (importar y usar componente)
3. **No requiere**: Modificar estilos globales ni schema de contenido
