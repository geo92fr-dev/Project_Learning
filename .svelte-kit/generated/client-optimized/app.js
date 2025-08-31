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
	() => import('./nodes/20')
];

export const server_loads = [];

export const dictionary = {
		"/": [5],
		"/auth-simple": [6],
		"/content": [7],
		"/cours": [8],
		"/cours/[slug]": [9],
		"/dashboard": [10],
		"/pedagogy": [11],
		"/test-content-fixed": [13],
		"/test-content": [12],
		"/test-exercises": [14],
		"/test-firebase-simple": [15],
		"/test-markdown": [16],
		"/[matiere]": [17,[2]],
		"/[matiere]/[niveau]": [18,[2,3]],
		"/[matiere]/[niveau]/[competence]": [19,[2,3,4]],
		"/[matiere]/[niveau]/[competence]/[cours]": [20,[2,3,4]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';