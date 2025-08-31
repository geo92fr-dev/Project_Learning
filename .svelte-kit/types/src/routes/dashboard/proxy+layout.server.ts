// @ts-nocheck
import type { LayoutServerLoad } from './$types';

export const load = async ({ locals, url }: Parameters<LayoutServerLoad>[0]) => {
	// Pour l'instant, pas de redirection automatique côté serveur
	// Car nous n'avons pas configuré Firebase Admin SDK
	// La protection sera gérée côté client
	
	return {
		user: locals.user || null,
		url: url.pathname
	};
};
