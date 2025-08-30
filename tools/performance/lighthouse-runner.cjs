#!/usr/bin/env node

/**
 * @criticality MEDIUM
 * @depends build/, lighthouse
 * @description Test de performance Lighthouse simplifié
 * @phase 2+ - Applicable aux phases avancées
 * @category performance
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class LighthouseRunner {
    constructor() {
        this.projectRoot = process.cwd();
        this.buildPath = path.join(this.projectRoot, '.svelte-kit', 'output', 'client');
        this.buildPathAlt = path.join(this.projectRoot, 'build');
    }

    /**
     * Vérification de la disponibilité du build
     */
    checkBuildAvailable() {
        // Chercher d'abord dans .svelte-kit/output/client, puis dans build/
        if (!fs.existsSync(this.buildPath) && !fs.existsSync(this.buildPathAlt)) {
            console.log('🏗️ Build requis pour les tests de performance...');
            execSync('npm run build', { 
                encoding: 'utf8',
                cwd: this.projectRoot,
                stdio: 'inherit'
            });
        }
        
        // Utiliser le répertoire qui existe
        if (fs.existsSync(this.buildPath)) {
            return true;
        } else if (fs.existsSync(this.buildPathAlt)) {
            this.buildPath = this.buildPathAlt;
            return true;
        }
        
        return false;
    }

    /**
     * Test basique de performance sur les fichiers statiques
     */
    async runBasicPerformanceCheck() {
        console.log('⚡ Analyse de performance basique...');
        
        try {
            // Vérifier la taille du bundle
            const buildStats = this.analyzeBundleSize();
            
            // Score basé sur la taille du bundle et des assets
            let performanceScore = 100;
            
            if (buildStats.totalSize > 1000000) { // > 1MB
                performanceScore -= 20;
            }
            if (buildStats.totalSize > 2000000) { // > 2MB
                performanceScore -= 20;
            }
            if (buildStats.jsSize > 500000) { // JS > 500KB
                performanceScore -= 15;
            }
            if (buildStats.cssSize > 100000) { // CSS > 100KB
                performanceScore -= 10;
            }
            
            console.log(`📊 Bundle Analysis:`);
            console.log(`   Total Size: ${(buildStats.totalSize / 1024).toFixed(2)} KB`);
            console.log(`   JS Size: ${(buildStats.jsSize / 1024).toFixed(2)} KB`);
            console.log(`   CSS Size: ${(buildStats.cssSize / 1024).toFixed(2)} KB`);
            console.log(`   Performance Score: ${Math.max(0, performanceScore)}/100`);
            
            return {
                score: Math.max(0, performanceScore),
                details: buildStats
            };
            
        } catch (error) {
            console.error('❌ Erreur analyse performance:', error.message);
            return {
                score: 0,
                details: { error: error.message }
            };
        }
    }

    /**
     * Analyse de la taille du bundle
     */
    analyzeBundleSize() {
        const buildPath = this.buildPath;
        let totalSize = 0;
        let jsSize = 0;
        let cssSize = 0;
        
        const analyzeDirectory = (dir) => {
            const files = fs.readdirSync(dir);
            
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isDirectory()) {
                    analyzeDirectory(filePath);
                } else {
                    const size = stat.size;
                    totalSize += size;
                    
                    if (file.endsWith('.js')) {
                        jsSize += size;
                    } else if (file.endsWith('.css')) {
                        cssSize += size;
                    }
                }
            }
        };
        
        if (fs.existsSync(buildPath)) {
            analyzeDirectory(buildPath);
        }
        
        return {
            totalSize,
            jsSize,
            cssSize,
            fileCount: this.countFiles(buildPath)
        };
    }

    /**
     * Comptage des fichiers
     */
    countFiles(dir) {
        if (!fs.existsSync(dir)) return 0;
        
        let count = 0;
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                count += this.countFiles(filePath);
            } else {
                count++;
            }
        }
        
        return count;
    }

    /**
     * Génération du rapport de performance
     */
    generateReport(results) {
        const report = `# ⚡ Performance Report

**Date**: ${new Date().toISOString()}
**Score**: ${results.score}/100

## 📊 Bundle Analysis
- **Total Size**: ${(results.details.totalSize / 1024).toFixed(2)} KB
- **JavaScript**: ${(results.details.jsSize / 1024).toFixed(2)} KB
- **CSS**: ${(results.details.cssSize / 1024).toFixed(2)} KB
- **File Count**: ${results.details.fileCount}

## 🎯 Recommendations
${this.generateRecommendations(results)}

---
*Généré par Lighthouse Runner v1.0*
`;

        const reportPath = path.join(this.projectRoot, 'REPORT_PERFORMANCE.md');
        fs.writeFileSync(reportPath, report, 'utf8');
        
        console.log(`📋 Rapport performance généré: ${reportPath}`);
        
        return results.score >= 80;
    }

    /**
     * Génération des recommandations
     */
    generateRecommendations(results) {
        const recommendations = [];
        
        if (results.details.totalSize > 1000000) {
            recommendations.push('- 📦 **Réduire la taille du bundle**: Utiliser le tree-shaking et la compression');
        }
        
        if (results.details.jsSize > 500000) {
            recommendations.push('- 🚀 **Optimiser JavaScript**: Code splitting et lazy loading');
        }
        
        if (results.details.cssSize > 100000) {
            recommendations.push('- 🎨 **Optimiser CSS**: Supprimer le CSS inutilisé');
        }
        
        if (results.score >= 90) {
            recommendations.push('- 🎉 **Excellente performance !** Bundle optimisé');
        } else if (results.score >= 80) {
            recommendations.push('- ✅ **Bonne performance** - Quelques améliorations possibles');
        } else {
            recommendations.push('- ⚠️ **Performance à améliorer** - Optimisations nécessaires');
        }
        
        return recommendations.length > 0 ? recommendations.join('\n') : '✨ Aucune recommandation spécifique';
    }
}

// Exécution
if (require.main === module) {
    const runner = new LighthouseRunner();
    
    runner.checkBuildAvailable();
    runner.runBasicPerformanceCheck()
        .then(results => {
            const success = runner.generateReport(results);
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('💥 Erreur Performance Runner:', error);
            process.exit(1);
        });
}

module.exports = LighthouseRunner;
