export const load = async ({ locals, url }: { locals: any; url: any }) => {
  // Pour l'instant, pas de redirection automatique côté serveur
  // Car nous n'avons pas configuré Firebase Admin SDK
  // La protection sera gérée côté client

  return {
    user: locals?.user || null,
    url: url?.pathname,
  };
};
