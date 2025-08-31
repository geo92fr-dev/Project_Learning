export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14')
];

export const server_loads = [];

export const dictionary = {
		"/": [5],
		"/auth": [6],
		"/cours": [7],
		"/cours/[slug]": [8],
		"/dashboard": [9],
		"/pedagogy": [10],
		"/[matiere]": [11,[2]],
		"/[matiere]/[niveau]": [12,[2,3]],
		"/[matiere]/[niveau]/[competence]": [13,[2,3,4]],
		"/[matiere]/[niveau]/[competence]/[cours]": [14,[2,3,4]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';