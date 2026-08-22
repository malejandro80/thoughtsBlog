import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

/** Devuelve los posts publicados ordenados por fecha descendente.
 * En producción excluye los drafts; en desarrollo los incluye para poder previsualizarlos. */
export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Devuelve las etiquetas únicas de una lista de posts, ordenadas alfabéticamente. */
export function getAllTags(posts: CollectionEntry<'blog'>[]): string[] {
  return [...new Set(posts.flatMap((post) => post.data.tags))].sort();
}

/** Devuelve hasta `limit` posts marcados como destacados, por fecha descendente.
 * Si no hay ninguno destacado, devuelve los últimos `limit` posts publicados. */
export async function getFeaturedPosts(limit = 3): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getPublishedPosts();
  const featured = posts.filter((post) => post.data.featured);
  return (featured.length > 0 ? featured : posts).slice(0, limit);
}
