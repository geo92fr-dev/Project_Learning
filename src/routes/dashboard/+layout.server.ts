import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Pour l'instant, pas de redirection automatique côté serveur
	// Car nous n'avons pas configuré Firebase Admin SDK
	// La protection sera gérée côté client
	
	return {
		user: locals.user || null,
		url: url.pathname
	};
};
