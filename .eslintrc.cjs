module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: [],
	ignorePatterns: [
		'*.cjs', 
		'.svelte-kit/**', 
		'node_modules/**', 
		'build/**',
		'extensions/**/out/**', // Ignorer les fichiers compilés de l'extension
		'coverage/**',
		'dist/**'
	],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		},
		{
			files: ['extensions/**/*.ts', 'extensions/**/*.js'],
			rules: {
				'no-console': 'off', // Console autorisé dans l'extension
				'complexity': ['warn', 20],
				'max-lines-per-function': ['warn', 350], // Extensions ont des fonctions très longues
				'no-unused-vars': 'off' // Variables non utilisées autorisées dans l'extension
			}
		},
		{
			files: ['tests/**/*.js', 'tools/**/*.js'],
			rules: {
				'no-console': 'off', // Console autorisé dans les tests et outils
				'complexity': 'off',
				'max-lines-per-function': 'off'
			}
		}
	],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	rules: {
		'complexity': ['warn', 15], // Plus permissif pour la complexité
		'max-depth': ['warn', 6], // Plus permissif pour la profondeur
		'max-lines-per-function': ['warn', 100], // Plus permissif pour la longueur
		'no-console': 'off', // Désactivé car utile pour debugging
		'no-unused-vars': 'warn',
		'svelte/valid-compile': 'warn',
		'svelte/no-at-html-tags': 'off' // Désactivé car nous utilisons du contenu sécurisé par DOMPurify
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
