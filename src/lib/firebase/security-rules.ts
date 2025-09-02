/**
 * 🛡️ Firebase Security Rules - Phase 5
 * Règles de sécurité Firestore pour la plateforme FunLearning
 */

// Types pour les règles de sécurité
export interface SecurityRule {
  collection: string;
  rule: string;
  description: string;
  level: 'read' | 'write' | 'delete';
}

export interface FirestoreRules {
  version: string;
  service: string;
  rules: SecurityRule[];
}

/**
 * Configuration des règles de sécurité par collection
 */
export const SECURITY_RULES: Record<string, SecurityRule[]> = {
  users: [
    {
      collection: 'users',
      rule: 'allow read, write: if request.auth != null && request.auth.uid == resource.id',
      description: 'Les utilisateurs peuvent lire/écrire leur propre profil',
      level: 'write'
    },
    {
      collection: 'users',
      rule: 'allow create: if request.auth != null && request.auth.uid == request.resource.id',
      description: 'Les utilisateurs peuvent créer leur propre profil',
      level: 'write'
    }
  ],
  
  courses: [
    {
      collection: 'courses',
      rule: 'allow read: if request.auth != null',
      description: 'Tous les utilisateurs authentifiés peuvent lire les cours',
      level: 'read'
    },
    {
      collection: 'courses',
      rule: 'allow write: if request.auth != null && resource.data.createdBy == request.auth.uid',
      description: 'Seuls les créateurs peuvent modifier leurs cours',
      level: 'write'
    }
  ],
  
  userProgress: [
    {
      collection: 'userProgress',
      rule: 'allow read, write: if request.auth != null && request.auth.uid == resource.data.userId',
      description: 'Les utilisateurs gèrent leur propre progression',
      level: 'write'
    }
  ],
  
  competences: [
    {
      collection: 'competences',
      rule: 'allow read: if request.auth != null',
      description: 'Lecture des compétences pour tous les utilisateurs authentifiés',
      level: 'read'
    },
    {
      collection: 'competences',
      rule: 'allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin"',
      description: 'Seuls les admins peuvent modifier les compétences',
      level: 'write'
    }
  ]
};

/**
 * Génère les règles Firestore complètes
 */
export function generateFirestoreRules(): string {
  const rulesHeader = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {`;

  const rulesFooter = `  }
}`;

  let rulesBody = '';

  // Génération des règles par collection
  Object.entries(SECURITY_RULES).forEach(([collection, rules]) => {
    rulesBody += `
    // Règles pour la collection ${collection}
    match /${collection}/{documentId} {`;

    rules.forEach(rule => {
      rulesBody += `
      // ${rule.description}
      ${rule.rule};`;
    });

    rulesBody += `
    }`;
  });

  return rulesHeader + rulesBody + rulesFooter;
}

/**
 * Valide les règles de sécurité pour une collection
 */
export function validateSecurityRules(collection: string): {
  valid: boolean;
  issues: string[];
  coverage: number;
} {
  const rules = SECURITY_RULES[collection];
  
  if (!rules || rules.length === 0) {
    return {
      valid: false,
      issues: [`Aucune règle définie pour la collection ${collection}`],
      coverage: 0
    };
  }

  const issues: string[] = [];
  const hasRead = rules.some(r => r.level === 'read');
  const hasWrite = rules.some(r => r.level === 'write');

  if (!hasRead) {
    issues.push(`Aucune règle de lecture pour ${collection}`);
  }

  if (!hasWrite) {
    issues.push(`Aucune règle d'écriture pour ${collection}`);
  }

  // Calcul de la couverture
  const expectedRules = ['read', 'write'];
  const actualRules = [...new Set(rules.map(r => r.level))];
  const coverage = (actualRules.length / expectedRules.length) * 100;

  return {
    valid: issues.length === 0,
    issues,
    coverage
  };
}

/**
 * Teste la sécurité d'une opération
 */
export function testSecurityRule(
  collection: string,
  operation: 'read' | 'write' | 'delete',
  context: {
    userId?: string;
    isAuthenticated: boolean;
    userRole?: string;
    resourceOwnerId?: string;
  }
): { allowed: boolean; reason: string } {
  
  if (!context.isAuthenticated) {
    return {
      allowed: false,
      reason: 'Utilisateur non authentifié'
    };
  }

  const rules = SECURITY_RULES[collection];
  if (!rules) {
    return {
      allowed: false,
      reason: `Aucune règle trouvée pour la collection ${collection}`
    };
  }

  // Logique de validation simplifiée
  const applicableRules = rules.filter(r => 
    r.level === operation || r.level === 'read' && operation === 'read'
  );

  if (applicableRules.length === 0) {
    return {
      allowed: false,
      reason: `Aucune règle ${operation} pour ${collection}`
    };
  }

  // Validation spécifique selon le contexte
  if (collection === 'users' && context.userId === context.resourceOwnerId) {
    return { allowed: true, reason: 'Accès autorisé à son propre profil' };
  }

  if (collection === 'courses' && operation === 'read') {
    return { allowed: true, reason: 'Lecture des cours autorisée' };
  }

  if (collection === 'competences' && operation === 'read') {
    return { allowed: true, reason: 'Lecture des compétences autorisée' };
  }

  if (context.userRole === 'admin') {
    return { allowed: true, reason: 'Accès admin autorisé' };
  }

  return {
    allowed: false,
    reason: 'Accès refusé par les règles de sécurité'
  };
}

/**
 * Export par défaut des règles générées
 */
export default generateFirestoreRules();
