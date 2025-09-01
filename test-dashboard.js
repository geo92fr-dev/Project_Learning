/**
 * Test rapide du dashboard curriculum
 * Verification que tout fonctionne end-to-end
 */

import { generateCurriculum } from './src/lib/curriculum/generator.js';

async function testCurriculumGeneration() {
  console.log('🧪 Test de génération de curriculum...\n');

  const config = {
    matiere: 'mathematiques',
    niveau: '6eme',
    competences: ['calcul-mental', 'geometrie-base'],
    difficulte: 'standard',
    dureeEstimee: 45,
    objectifs: ['Maîtriser les opérations de base', 'Comprendre les formes géométriques']
  };

  try {
    const startTime = Date.now();
    const curriculum = await generateCurriculum(config);
    const duration = Date.now() - startTime;

    console.log('✅ Curriculum généré avec succès !');
    console.log(`⏱️  Temps de génération: ${duration}ms`);
    console.log(`📚 ID: ${curriculum.id}`);
    console.log(`📖 Matière: ${curriculum.matiere} - ${curriculum.niveau}`);
    console.log(`🎯 Modules: ${curriculum.modules.length}`);
    console.log(`📝 Activités totales: ${curriculum.modules.reduce((sum, m) => sum + m.activites.length, 0)}`);
    console.log(`⏰ Durée totale: ${curriculum.modules.reduce((sum, m) => sum + m.dureeEstimee, 0)} minutes`);
    
    console.log('\n📋 Structure des modules:');
    curriculum.modules.forEach((module, index) => {
      console.log(`  ${index + 1}. ${module.titre} (${module.dureeEstimee}min, ${module.activites.length} activités)`);
    });

    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error.message);
    return false;
  }
}

// Execution du test
testCurriculumGeneration()
  .then(success => {
    if (success) {
      console.log('\n🎉 Test réussi ! Le dashboard curriculum est prêt à être utilisé.');
    } else {
      console.log('\n💥 Test échoué. Vérifiez la configuration.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
