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
