/** Formats a date in the given locale: "22 de agosto de 2026" (es) or "August 22, 2026" (en). */
export function formattedDate(date: Date, locale: string = 'es'): string {
  const tag = locale === 'en' ? 'en-US' : 'es-ES';
  return date.toLocaleDateString(tag, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
