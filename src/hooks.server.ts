import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // Pour l'instant, pas de validation côté serveur Firebase Admin
  // Car nous n'avons pas configuré les clés Admin SDK
  // TODO: Ajouter validation Firebase Admin quand les clés seront disponibles

  // Simuler un utilisateur pour les tests (à supprimer en production)
  if (event.url.pathname.startsWith("/dashboard")) {
    // Pour l'instant, permettre l'accès au dashboard
    // La protection sera gérée côté client
  }

  return resolve(event);
};
