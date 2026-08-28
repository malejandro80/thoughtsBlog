import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

/** Returns published posts for a given locale, sorted by date descending.
 * In production excludes drafts; in development includes them for preview. */
export async function getPublishedPosts(locale?: string): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data, id }) => {
    const matchesLocale = locale ? id.startsWith(`${locale}/`) : true;
    const notDraft = import.meta.env.PROD ? !data.draft : true;
    return matchesLocale && notDraft;
  });
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Returns unique tags from a list of posts, sorted alphabetically. */
export function getAllTags(posts: CollectionEntry<'blog'>[]): string[] {
  return [...new Set(posts.flatMap((post) => post.data.tags))].sort();
}

/** Returns up to `limit` featured posts for a locale, sorted by date descending.
 * If no posts are featured, returns the latest `limit` published posts. */
export async function getFeaturedPosts(limit = 3, locale?: string): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getPublishedPosts(locale);
  const featured = posts.filter((post) => post.data.featured);
  return (featured.length > 0 ? featured : posts).slice(0, limit);
}

/** Strips the locale prefix from a post ID to get the slug.
 *  e.g. "es/blog/my-post" → "my-post" */
export function stripLocale(id: string): string {
  const parts = id.split('/');
  // ID format: {locale}/blog/{slug}
  return parts.length >= 3 ? parts.slice(2).join('/') : id;
}
