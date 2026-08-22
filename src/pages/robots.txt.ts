import type { APIContext } from 'astro';

export function GET({ site }: APIContext) {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${site}sitemap-index.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
