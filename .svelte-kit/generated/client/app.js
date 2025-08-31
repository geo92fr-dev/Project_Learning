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
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21')
];

export const server_loads = [2];

export const dictionary = {
		"/": [6],
		"/auth-google": [8],
		"/auth/login": [7],
		"/content": [9],
		"/cours": [10],
		"/cours/[slug]": [11],
		"/dashboard": [12,[2]],
		"/pedagogy": [13],
		"/test-content-fixed": [15],
		"/test-content": [14],
		"/test-exercises": [16],
		"/test-markdown": [17],
		"/[matiere]": [18,[3]],
		"/[matiere]/[niveau]": [19,[3,4]],
		"/[matiere]/[niveau]/[competence]": [20,[3,4,5]],
		"/[matiere]/[niveau]/[competence]/[cours]": [21,[3,4,5]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';