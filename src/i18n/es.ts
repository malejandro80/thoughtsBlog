const es = {
  nav: { home: 'Inicio', blog: 'Blog', portfolio: 'Portafolio' },
  home: { featured: 'Posts destacados', viewAll: 'Ver todos los posts →' },
  blog: { title: 'Todos los posts', archive: 'Archivo completo de todos los posts del blog.' },
  back: { home: 'Inicio', blog: 'Todos los posts' },
  post: { updated: 'Actualizado:' },
  notFound: { title: '404', message: 'No encontré esta página.', back: 'Volver al inicio' },
  footnote: 'La intención principal de este post es pensar y hacer pensar, independientemente del sentimiento que pueda suscitar. Si así ha sido el caso me doy por bien servido y como dice el meme: "Mi trabajo aquí ha terminado"',
  footer: { rss: 'RSS' },
} as const;

export default es;
