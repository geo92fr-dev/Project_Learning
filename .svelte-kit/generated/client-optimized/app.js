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
	() => import('./nodes/31')
];

export const server_loads = [2];

export const dictionary = {
		"/": [6],
		"/auth-google": [9],
		"/auth": [7],
		"/auth/login": [8],
		"/complete": [10],
		"/content": [11],
		"/content/[matiere]": [12],
		"/content/[matiere]/[niveau]": [13],
		"/content/[matiere]/[niveau]/[competence]": [14],
		"/cours": [15],
		"/cours/[slug]": [16],
		"/dashboard": [17,[2]],
		"/demo": [18],
		"/demo/exercise": [19],
		"/demo/markdown": [20],
		"/pedagogy": [21],
		"/roadmap": [22],
		"/test-content-fixed": [24],
		"/test-content": [23],
		"/test-exercises": [25],
		"/test-markdown": [26],
		"/tests": [27],
		"/[matiere]": [28,[3]],
		"/[matiere]/[niveau]": [29,[3,4]],
		"/[matiere]/[niveau]/[competence]": [30,[3,4,5]],
		"/[matiere]/[niveau]/[competence]/[cours]": [31,[3,4,5]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';