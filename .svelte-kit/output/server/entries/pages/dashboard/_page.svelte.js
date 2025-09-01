import { s as subscribe } from "../../../chunks/utils.js";
import { c as create_ssr_component, o as onDestroy } from "../../../chunks/ssr.js";
import { w as writable } from "../../../chunks/index2.js";
import "../../../chunks/googleAuth.js";
import "isomorphic-dompurify";
import { z } from "zod";
const completedCoursesStore = writable([]);
const authInfoStore = writable({ isAuthenticated: null, user: null });
const userProfileStore = writable(null);
const coursesStore = writable([]);
const currentCoursesStore = writable([]);
const userStatsStore = writable(null);
function secureString(maxLength = 255) {
  return z.string().max(maxLength, `Texte trop long (max: ${maxLength} caractères)`).refine(
    (val) => !/<script|javascript:|data:|vbscript:|onload=|onerror=/i.test(val),
    { message: "Contenu potentiellement malveillant détecté" }
  ).refine(
    (val) => !/[\u0000-\u001F\u007F-\u009F\uFEFF\u200B-\u200F\u2028-\u202F\uFDD0-\uFDEF\uFFFE\uFFFF]/.test(
      val
    ),
    { message: "Caractères Unicode non autorisés détectés" }
  );
}
function secureEmail() {
  return z.string().email("Format email invalide").max(254, "Email trop long").refine(
    (val) => !/[\u0000-\u001F\u007F-\u009F\uFEFF\u200B-\u200F\u2028-\u202F]/.test(
      val
    ),
    { message: "Caractères Unicode non autorisés dans l'email" }
  );
}
z.object({
  id: secureString(50),
  email: secureEmail(),
  displayName: secureString(100),
  photoURL: z.string().url().optional(),
  role: z.enum(["student", "teacher", "admin"]),
  createdAt: z.string(),
  lastLoginAt: z.string(),
  preferences: z.object({
    language: z.string().default("fr"),
    theme: z.enum(["light", "dark", "auto"]).default("auto"),
    notifications: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(true),
      marketing: z.boolean().default(false)
    }),
    accessibility: z.object({
      fontSize: z.enum(["small", "medium", "large"]).default("medium"),
      highContrast: z.boolean().default(false),
      reducedMotion: z.boolean().default(false)
    })
  }).default({
    language: "fr",
    theme: "auto",
    notifications: {
      email: true,
      push: true,
      marketing: false
    },
    accessibility: {
      fontSize: "medium",
      highContrast: false,
      reducedMotion: false
    }
  }),
  learningProfile: z.object({
    style: z.enum(["visual", "auditory", "kinesthetic", "reading", "mixed"]).default("mixed"),
    difficultyPreference: z.number().min(0).max(1).default(0.5),
    sessionDurationPreference: z.number().positive().default(30),
    // minutes
    learningGoals: z.array(z.string()).default([]),
    interests: z.array(z.string()).default([])
  }).default({
    style: "mixed",
    difficultyPreference: 0.5,
    sessionDurationPreference: 30,
    learningGoals: [],
    interests: []
  }),
  progressTracking: z.object({
    totalTimeSpent: z.number().default(0),
    // minutes
    coursesCompleted: z.number().default(0),
    competencesAcquired: z.array(z.string()).default([]),
    currentStreak: z.number().default(0),
    // jours consécutifs
    longestStreak: z.number().default(0),
    averageScore: z.number().min(0).max(1).optional()
  }).default({
    totalTimeSpent: 0,
    coursesCompleted: 0,
    competencesAcquired: [],
    currentStreak: 0,
    longestStreak: 0
  }),
  metadata: z.object({
    version: z.string().default("1.0"),
    lastUpdated: z.string(),
    isActive: z.boolean().default(true),
    gdprConsent: z.object({
      functional: z.boolean(),
      analytics: z.boolean(),
      marketing: z.boolean(),
      consentDate: z.string()
    })
  }).optional().transform(
    (val) => val || {
      version: "1.0",
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
      isActive: true,
      gdprConsent: {
        functional: false,
        analytics: false,
        marketing: false,
        consentDate: (/* @__PURE__ */ new Date()).toISOString()
      }
    }
  )
});
z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  estimatedDuration: z.number().positive(),
  // minutes
  language: z.string().default("fr"),
  tags: z.array(z.string()).default([]),
  competenceIds: z.array(z.string()),
  prerequisites: z.array(z.string()).default([]),
  content: z.object({
    modules: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        order: z.number(),
        lessons: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            type: z.enum(["video", "text", "interactive", "quiz"]),
            content: z.string(),
            duration: z.number(),
            resources: z.array(
              z.object({
                type: z.string(),
                url: z.string(),
                title: z.string()
              })
            ).default([])
          })
        )
      })
    )
  }),
  assessment: z.object({
    preAssessment: z.string().optional(),
    // ID de l'évaluation
    postAssessment: z.string().optional(),
    continuousAssessment: z.array(z.string()).default([]),
    passingScore: z.number().min(0).max(1).default(0.7)
  }),
  analytics: z.object({
    totalEnrollments: z.number().default(0),
    completionRate: z.number().min(0).max(1).default(0),
    averageRating: z.number().min(0).max(5).optional(),
    totalRatings: z.number().default(0)
  }),
  metadata: z.object({
    authorId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    version: z.string().default("1.0"),
    isPublished: z.boolean().default(false),
    publishedAt: z.string().optional()
  })
});
z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  level: z.number().min(1).max(5),
  // Échelle 1-5
  prerequisites: z.array(z.string()).default([]),
  learningObjectives: z.array(z.string()),
  assessmentCriteria: z.array(
    z.object({
      criterion: z.string(),
      weight: z.number().min(0).max(1)
    })
  ),
  resources: z.array(
    z.object({
      type: z.enum(["course", "exercise", "reading", "video"]),
      resourceId: z.string(),
      title: z.string(),
      difficulty: z.number().min(0).max(1)
    })
  ).default([]),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    createdBy: z.string(),
    isActive: z.boolean().default(true)
  })
});
z.object({
  id: z.string(),
  // userId-courseId
  userId: z.string(),
  courseId: z.string(),
  status: z.enum(["not_started", "in_progress", "completed", "paused"]),
  // Métriques de progression
  score: z.number().min(0).max(100).default(0),
  completed: z.boolean().default(false),
  lastAttempt: z.string()
  // ISO timestamp
});
const UserProfileCard_svelte_svelte_type_style_lang = "";
const CourseCard_svelte_svelte_type_style_lang = "";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".dashboard.svelte-ovh31o.svelte-ovh31o{max-width:1200px;margin:0 auto;padding:2rem;min-height:100vh}.loading-container.svelte-ovh31o.svelte-ovh31o{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh;text-align:center}.loading-spinner.svelte-ovh31o.svelte-ovh31o{width:48px;height:48px;border:4px solid var(--background-light, #f3f3f3);border-top:4px solid var(--primary-color, #007bff);border-radius:50%;animation:svelte-ovh31o-spin 1s linear infinite;margin-bottom:1rem}@keyframes svelte-ovh31o-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.error-container.svelte-ovh31o.svelte-ovh31o,.auth-required.svelte-ovh31o.svelte-ovh31o{text-align:center;padding:2rem;background:var(--surface-color, white);border-radius:12px;border:1px solid var(--border-color, #e0e0e0)}.error-container.svelte-ovh31o h2.svelte-ovh31o,.auth-required.svelte-ovh31o h2.svelte-ovh31o{color:var(--error-color, #dc3545);margin-bottom:1rem}.profile-section.svelte-ovh31o.svelte-ovh31o{margin-bottom:3rem}.stats-section.svelte-ovh31o.svelte-ovh31o{margin-bottom:3rem}.stats-section.svelte-ovh31o h2.svelte-ovh31o{margin-bottom:1.5rem;color:var(--text-primary, #333)}.stats-grid.svelte-ovh31o.svelte-ovh31o{display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1.5rem;margin-bottom:2rem}.stat-card.svelte-ovh31o.svelte-ovh31o{background:var(--surface-color, white);padding:2rem;border-radius:12px;text-align:center;border:1px solid var(--border-color, #e0e0e0);transition:transform 0.2s, box-shadow 0.2s}.stat-card.svelte-ovh31o.svelte-ovh31o:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0, 0, 0, 0.1)}.stat-card.svelte-ovh31o h3.svelte-ovh31o{font-size:2.5rem;font-weight:bold;color:var(--primary-color, #007bff);margin:0 0 0.5rem 0}.stat-card.svelte-ovh31o p.svelte-ovh31o{color:var(--text-secondary, #666);margin:0;font-size:0.875rem;text-transform:uppercase;letter-spacing:0.5px}.current-courses-section.svelte-ovh31o.svelte-ovh31o,.available-courses-section.svelte-ovh31o.svelte-ovh31o,.completed-courses-section.svelte-ovh31o.svelte-ovh31o{margin-bottom:3rem}.current-courses-section.svelte-ovh31o h2.svelte-ovh31o,.available-courses-section.svelte-ovh31o h2.svelte-ovh31o,.completed-courses-section.svelte-ovh31o h2.svelte-ovh31o{margin-bottom:1.5rem;color:var(--text-primary, #333)}.courses-grid.svelte-ovh31o.svelte-ovh31o{display:grid;grid-template-columns:repeat(auto-fill, minmax(350px, 1fr));gap:1.5rem}.view-more.svelte-ovh31o.svelte-ovh31o{text-align:center;margin-top:2rem}.empty-state.svelte-ovh31o.svelte-ovh31o{text-align:center;padding:4rem 2rem}.empty-content.svelte-ovh31o.svelte-ovh31o{max-width:500px;margin:0 auto}.empty-content.svelte-ovh31o h2.svelte-ovh31o{color:var(--text-primary, #333);margin-bottom:1rem}.empty-content.svelte-ovh31o p.svelte-ovh31o{color:var(--text-secondary, #666);margin-bottom:2rem;line-height:1.6}.btn.svelte-ovh31o.svelte-ovh31o{padding:0.75rem 1.5rem;border:none;border-radius:8px;font-size:0.875rem;font-weight:500;cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-block}.btn-primary.svelte-ovh31o.svelte-ovh31o{background:var(--primary-color, #007bff);color:white}.btn-outline.svelte-ovh31o.svelte-ovh31o{background:transparent;color:var(--primary-color, #007bff);border:1px solid var(--primary-color, #007bff)}.btn.svelte-ovh31o.svelte-ovh31o:hover{transform:translateY(-1px);box-shadow:0 2px 8px rgba(0, 0, 0, 0.1)}@media(max-width: 768px){.dashboard.svelte-ovh31o.svelte-ovh31o{padding:1rem}.stats-grid.svelte-ovh31o.svelte-ovh31o{grid-template-columns:repeat(auto-fit, minmax(150px, 1fr));gap:1rem}.stat-card.svelte-ovh31o.svelte-ovh31o{padding:1.5rem}.stat-card.svelte-ovh31o h3.svelte-ovh31o{font-size:2rem}.courses-grid.svelte-ovh31o.svelte-ovh31o{grid-template-columns:1fr;gap:1rem}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_authInfoStore;
  let $$unsubscribe_userStatsStore;
  let $$unsubscribe_completedCoursesStore;
  let $$unsubscribe_currentCoursesStore;
  let $$unsubscribe_coursesStore;
  let $$unsubscribe_userProfileStore;
  $$unsubscribe_authInfoStore = subscribe(authInfoStore, (value) => value);
  $$unsubscribe_userStatsStore = subscribe(userStatsStore, (value) => value);
  $$unsubscribe_completedCoursesStore = subscribe(completedCoursesStore, (value) => value);
  $$unsubscribe_currentCoursesStore = subscribe(currentCoursesStore, (value) => value);
  $$unsubscribe_coursesStore = subscribe(coursesStore, (value) => value);
  $$unsubscribe_userProfileStore = subscribe(userProfileStore, (value) => value);
  onDestroy(() => {
  });
  $$result.css.add(css);
  $$unsubscribe_authInfoStore();
  $$unsubscribe_userStatsStore();
  $$unsubscribe_completedCoursesStore();
  $$unsubscribe_currentCoursesStore();
  $$unsubscribe_coursesStore();
  $$unsubscribe_userProfileStore();
  return `/** * Dashboard Page - Firebase Integration Example * Phase 5B: Frontend
Integration - Complete Example * * @description Page de tableau de bord
utilisant les stores Firebase * @follows MyDevFramework CoPilot Best Practices
*/

${$$result.head += `<!-- HEAD_svelte-yoz9h7_START -->${$$result.title = `<title>Tableau de bord - FunLearning</title>`, ""}<meta name="description" content="Votre tableau de bord d'apprentissage personnalisé"><!-- HEAD_svelte-yoz9h7_END -->`, ""} <div class="dashboard svelte-ovh31o" data-testid="dashboard">${`<div class="loading-container svelte-ovh31o" data-testid="loading" data-svelte-h="svelte-4lkdtd"><div class="loading-spinner svelte-ovh31o"></div> <p>Chargement de votre tableau de bord...</p></div>`} </div>`;
});
export {
  Page as default
};
