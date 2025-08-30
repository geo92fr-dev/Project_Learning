module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: [],
	ignorePatterns: ['*.cjs', '.svelte-kit/**', 'node_modules/**', 'build/**'],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	rules: {
		'complexity': ['warn', 8],
		'max-depth': ['warn', 4],
		'max-lines-per-function': ['warn', 50],
		'no-console': 'warn',
		'no-unused-vars': 'warn',
		'svelte/valid-compile': 'warn'
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
