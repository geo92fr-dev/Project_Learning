#!/usr/bin/env node

/**
 * Script de validation Phase 4 - Pédagogie Avancée
 * Valide les fonctionnalités de pré-évaluation et métacognition
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync, statSync } from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

// Configuration des critères de validation Phase 4
const PHASE4_CRITERIA = {
	types: {
		name: '📝 Types pédagogiques',
		path: 'src/lib/types/pedagogy.ts',
		minSize: 10000,
		required: true
	},
	preEvaluation: {
		name: '🧠 Service de pré-évaluation',
		path: 'src/lib/services/preEvaluation.ts',
		minSize: 15000,
		required: true
	},
	metacognition: {
		name: '💭 Service de métacognition',
		path: 'src/lib/services/metacognition.ts',
		minSize: 20000,
		required: true
	},
	preEvalQuiz: {
		name: '📋 Composant PreEvaluationQuiz',
		path: 'src/lib/components/PreEvaluationQuiz.svelte',
		minSize: 8000,
		required: true
	},
	metacogPrompts: {
		name: '🎯 Composant MetacognitionPrompts',
		path: 'src/lib/components/MetacognitionPrompts.svelte',
		minSize: 10000,
		required: true
	},
	adaptiveContent: {
		name: '📚 Service de contenu adaptatif',
		path: 'src/lib/services/adaptiveContent.ts',
		minSize: 5000,
		required: false
	},
	learningDashboard: {
		name: '📊 Composant LearningDashboard',
		path: 'src/lib/components/LearningDashboard.svelte',
		minSize: 5000,
		required: false
	}
};

// Couleurs pour l'affichage
const colors = {
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
	reset: '\x1b[0m',
	bold: '\x1b[1m'
};

/**
 * Affiche un message coloré
 */
function colorLog(color, message) {
	console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Vérifie l'existence et la taille d'un fichier
 */
function validateFile(criteria) {
	const filePath = join(PROJECT_ROOT, criteria.path);
	
	if (!existsSync(filePath)) {
		return {
			exists: false,
			size: 0,
			valid: false,
			message: `Fichier manquant: ${criteria.path}`
		};
	}

	const stats = statSync(filePath);
	const isValidSize = stats.size >= criteria.minSize;

	return {
		exists: true,
		size: stats.size,
		valid: isValidSize,
		message: isValidSize 
			? `✅ ${criteria.name} (${stats.size} bytes)`
			: `⚠️ ${criteria.name} trop petit (${stats.size}/${criteria.minSize} bytes)`
	};
}

/**
 * Vérifie la structure des types TypeScript
 */
function validateTypeStructure() {
	const typesPath = join(PROJECT_ROOT, 'src/lib/types/pedagogy.ts');
	
	if (!existsSync(typesPath)) {
		return { valid: false, message: 'Types pedagogy.ts manquants' };
	}

	const content = readFileSync(typesPath, 'utf8');
	
	const requiredTypes = [
		'PreEvaluationQuestion',
		'PreEvaluationResponse',
		'PreEvaluationResult',
		'MetacognitionPrompt',
		'MetacognitionResponse',
		'AdaptiveLearningPath',
		'LearnerProfile'
	];

	const missingTypes = requiredTypes.filter(type => !content.includes(`interface ${type}`));
	
	if (missingTypes.length > 0) {
		return {
			valid: false,
			message: `Types manquants: ${missingTypes.join(', ')}`
		};
	}

	return {
		valid: true,
		message: '✅ Structure des types complète'
	};
}

/**
 * Vérifie l'intégration des services
 */
function validateServiceIntegration() {
	const services = [
		'src/lib/services/preEvaluation.ts',
		'src/lib/services/metacognition.ts'
	];

	const results = [];
	
	for (const servicePath of services) {
		const fullPath = join(PROJECT_ROOT, servicePath);
		
		if (!existsSync(fullPath)) {
			results.push({
				valid: false,
				message: `Service manquant: ${servicePath}`
			});
			continue;
		}

		const content = readFileSync(fullPath, 'utf8');
		
		// Vérifications spécifiques par service
		if (servicePath.includes('preEvaluation')) {
			const hasAlgorithm = content.includes('AdaptiveAlgorithm');
			const hasQuestionGenerator = content.includes('QuestionGenerator');
			const hasStores = content.includes('writable') && content.includes('derived');
			
			results.push({
				valid: hasAlgorithm && hasQuestionGenerator && hasStores,
				message: hasAlgorithm && hasQuestionGenerator && hasStores
					? '✅ Service pré-évaluation complet (algorithme + générateur + stores)'
					: `⚠️ Service pré-évaluation incomplet (algorithme:${hasAlgorithm}, générateur:${hasQuestionGenerator}, stores:${hasStores})`
			});
		}
		
		if (servicePath.includes('metacognition')) {
			const hasPromptBank = content.includes('MetacognitionPromptBank');
			const hasAnalyzer = content.includes('ResponseAnalyzer');
			const hasService = content.includes('MetacognitionService');
			
			results.push({
				valid: hasPromptBank && hasAnalyzer && hasService,
				message: hasPromptBank && hasAnalyzer && hasService
					? '✅ Service métacognition complet (banque + analyseur + service)'
					: `⚠️ Service métacognition incomplet (banque:${hasPromptBank}, analyseur:${hasAnalyzer}, service:${hasService})`
			});
		}
	}

	return results;
}

/**
 * Vérifie la qualité des composants Svelte
 */
function validateSvelteComponents() {
	const components = [
		{
			path: 'src/lib/components/PreEvaluationQuiz.svelte',
			name: 'PreEvaluationQuiz',
			requiredFeatures: ['bind:value', 'on:click', 'transition:', 'export let']
		},
		{
			path: 'src/lib/components/MetacognitionPrompts.svelte',
			name: 'MetacognitionPrompts',
			requiredFeatures: ['textarea', 'bind:value', 'transition:', 'export let']
		}
	];

	const results = [];

	for (const component of components) {
		const fullPath = join(PROJECT_ROOT, component.path);
		
		if (!existsSync(fullPath)) {
			results.push({
				valid: false,
				message: `Composant manquant: ${component.name}`
			});
			continue;
		}

		const content = readFileSync(fullPath, 'utf8');
		const hasFeatures = component.requiredFeatures.every(feature => content.includes(feature));
		const hasStyle = content.includes('<style>') || content.includes('class=');
		const hasScript = content.includes('<script');

		results.push({
			valid: hasFeatures && hasStyle && hasScript,
			message: hasFeatures && hasStyle && hasScript
				? `✅ ${component.name} complet (fonctionnalités + styles + script)`
				: `⚠️ ${component.name} incomplet (fonctionnalités:${hasFeatures}, styles:${hasStyle}, script:${hasScript})`
		});
	}

	return results;
}

/**
 * Vérifie l'accessibilité des composants
 */
function validateAccessibility() {
	const accessibilityChecks = [];
	
	// Vérifier les patterns d'accessibilité dans les composants
	const componentsToCheck = [
		'src/lib/components/PreEvaluationQuiz.svelte',
		'src/lib/components/MetacognitionPrompts.svelte'
	];

	for (const componentPath of componentsToCheck) {
		const fullPath = join(PROJECT_ROOT, componentPath);
		
		if (existsSync(fullPath)) {
			const content = readFileSync(fullPath, 'utf8');
			
			const hasAriaLabels = content.includes('aria-') || content.includes('role=');
			const hasFocusManagement = content.includes(':focus') || content.includes('tabindex');
			const hasKeyboardSupport = content.includes('on:keydown') || content.includes('on:keyup');
			
			const score = [hasAriaLabels, hasFocusManagement, hasKeyboardSupport].filter(Boolean).length;
			
			accessibilityChecks.push({
				valid: score >= 2,
				message: `${componentPath}: Score accessibilité ${score}/3 (ARIA:${hasAriaLabels}, Focus:${hasFocusManagement}, Clavier:${hasKeyboardSupport})`
			});
		}
	}

	return accessibilityChecks;
}

/**
 * Vérifie les performances du code
 */
function validatePerformance() {
	const performanceChecks = [];
	
	// Vérifier l'utilisation de stores Svelte optimisés
	const storeFiles = [
		'src/lib/services/preEvaluation.ts',
		'src/lib/services/metacognition.ts'
	];

	for (const storeFile of storeFiles) {
		const fullPath = join(PROJECT_ROOT, storeFile);
		
		if (existsSync(fullPath)) {
			const content = readFileSync(fullPath, 'utf8');
			
			const usesDerived = content.includes('derived(');
			const usesWritable = content.includes('writable(');
			const hasOptimizations = content.includes('singleton') || content.includes('getInstance');
			
			performanceChecks.push({
				valid: usesDerived && usesWritable && hasOptimizations,
				message: `${storeFile}: Optimisations (derived:${usesDerived}, writable:${usesWritable}, singleton:${hasOptimizations})`
			});
		}
	}

	return performanceChecks;
}

/**
 * Vérifie la documentation
 */
function validateDocumentation() {
	const docChecks = [];
	
	// Vérifier les commentaires JSDoc dans les services
	const serviceFiles = [
		'src/lib/services/preEvaluation.ts',
		'src/lib/services/metacognition.ts'
	];

	for (const serviceFile of serviceFiles) {
		const fullPath = join(PROJECT_ROOT, serviceFile);
		
		if (existsSync(fullPath)) {
			const content = readFileSync(fullPath, 'utf8');
			
			const jsdocCount = (content.match(/\/\*\*/g) || []).length;
			const exportCount = (content.match(/export \w+/g) || []).length;
			const documentationRatio = exportCount > 0 ? jsdocCount / exportCount : 0;
			
			docChecks.push({
				valid: documentationRatio >= 0.5,
				message: `${serviceFile}: Documentation ${Math.round(documentationRatio * 100)}% (${jsdocCount}/${exportCount})`
			});
		}
	}

	return docChecks;
}

/**
 * Exécute la validation complète
 */
async function runPhase4Validation() {
	console.log('\n🧠 VALIDATION PHASE 4 - PÉDAGOGIE AVANCÉE');
	console.log('==========================================\n');

	let totalChecks = 0;
	let passedChecks = 0;
	let criticalFailures = 0;

	// 1. Validation des fichiers essentiels
	colorLog('blue', '📁 Validation des fichiers essentiels...');
	for (const [key, criteria] of Object.entries(PHASE4_CRITERIA)) {
		const result = validateFile(criteria);
		totalChecks++;
		
		if (result.valid) {
			passedChecks++;
			colorLog('green', `  ${result.message}`);
		} else {
			if (criteria.required) {
				criticalFailures++;
				colorLog('red', `  ❌ ${result.message} (CRITIQUE)`);
			} else {
				colorLog('yellow', `  ⚠️ ${result.message} (OPTIONNEL)`);
			}
		}
	}

	// 2. Validation de la structure des types
	colorLog('blue', '\n📝 Validation de la structure des types...');
	const typesResult = validateTypeStructure();
	totalChecks++;
	if (typesResult.valid) {
		passedChecks++;
		colorLog('green', `  ${typesResult.message}`);
	} else {
		criticalFailures++;
		colorLog('red', `  ❌ ${typesResult.message}`);
	}

	// 3. Validation de l'intégration des services
	colorLog('blue', '\n⚙️ Validation de l\'intégration des services...');
	const serviceResults = validateServiceIntegration();
	for (const result of serviceResults) {
		totalChecks++;
		if (result.valid) {
			passedChecks++;
			colorLog('green', `  ${result.message}`);
		} else {
			criticalFailures++;
			colorLog('red', `  ❌ ${result.message}`);
		}
	}

	// 4. Validation des composants Svelte
	colorLog('blue', '\n🎨 Validation des composants Svelte...');
	const componentResults = validateSvelteComponents();
	for (const result of componentResults) {
		totalChecks++;
		if (result.valid) {
			passedChecks++;
			colorLog('green', `  ${result.message}`);
		} else {
			colorLog('yellow', `  ⚠️ ${result.message}`);
		}
	}

	// 5. Validation de l'accessibilité
	colorLog('blue', '\n♿ Validation de l\'accessibilité...');
	const a11yResults = validateAccessibility();
	for (const result of a11yResults) {
		totalChecks++;
		if (result.valid) {
			passedChecks++;
			colorLog('green', `  ✅ ${result.message}`);
		} else {
			colorLog('yellow', `  ⚠️ ${result.message}`);
		}
	}

	// 6. Validation des performances
	colorLog('blue', '\n⚡ Validation des performances...');
	const perfResults = validatePerformance();
	for (const result of perfResults) {
		totalChecks++;
		if (result.valid) {
			passedChecks++;
			colorLog('green', `  ✅ ${result.message}`);
		} else {
			colorLog('yellow', `  ⚠️ ${result.message}`);
		}
	}

	// 7. Validation de la documentation
	colorLog('blue', '\n📚 Validation de la documentation...');
	const docResults = validateDocumentation();
	for (const result of docResults) {
		totalChecks++;
		if (result.valid) {
			passedChecks++;
			colorLog('green', `  ✅ ${result.message}`);
		} else {
			colorLog('yellow', `  ⚠️ ${result.message}`);
		}
	}

	// Résumé final
	console.log('\n' + '='.repeat(50));
	const successRate = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
	
	if (criticalFailures === 0 && successRate >= 70) {
		colorLog('green', `✅ PHASE 4 VALIDATION RÉUSSIE`);
		colorLog('green', `📊 Score: ${passedChecks}/${totalChecks} (${successRate}%)`);
		colorLog('green', `🎯 Pédagogie avancée opérationnelle`);
		return true;
	} else {
		colorLog('red', `❌ PHASE 4 VALIDATION ÉCHOUÉE`);
		colorLog('red', `📊 Score: ${passedChecks}/${totalChecks} (${successRate}%)`);
		if (criticalFailures > 0) {
			colorLog('red', `💥 ${criticalFailures} échec(s) critique(s)`);
		}
		colorLog('yellow', `🔧 Corrections nécessaires avant validation`);
		return false;
	}
}

// Exécution principale
if (import.meta.url === `file://${process.argv[1]}`) {
	runPhase4Validation()
		.then(success => {
			process.exit(success ? 0 : 1);
		})
		.catch(error => {
			console.error('❌ Erreur lors de la validation:', error);
			process.exit(1);
		});
}

export { runPhase4Validation };
