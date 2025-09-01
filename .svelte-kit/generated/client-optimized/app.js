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
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33'),
	() => import('./nodes/34'),
	() => import('./nodes/35'),
	() => import('./nodes/36')
];

export const server_loads = [2];

export const dictionary = {
		"/": [6],
		"/auth-google": [9],
		"/auth-test": [10],
		"/auth": [7],
		"/auth/login": [8],
		"/complete": [11],
		"/content": [12],
		"/content/[matiere]": [13],
		"/content/[matiere]/[niveau]": [14],
		"/content/[matiere]/[niveau]/[competence]": [15],
		"/cours": [16],
		"/cours/[slug]": [17],
		"/dashboard": [18,[2]],
		"/demo": [19],
		"/demo/exercise": [20],
		"/demo/markdown": [21],
		"/pedagogy": [22],
		"/roadmap": [23],
		"/test-auth": [24],
		"/test-content-fixed": [26],
		"/test-content": [25],
		"/test-exercises": [27],
		"/test-firebase-simple": [29],
		"/test-firebase": [28],
		"/test-markdown": [30],
		"/test-phase4": [31],
		"/tests": [32],
		"/[matiere]": [33,[3]],
		"/[matiere]/[niveau]": [34,[3,4]],
		"/[matiere]/[niveau]/[competence]": [35,[3,4,5]],
		"/[matiere]/[niveau]/[competence]/[cours]": [36,[3,4,5]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';