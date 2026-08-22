/** Formatea una fecha en español: "22 de agosto de 2026". */
export function formattedDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
