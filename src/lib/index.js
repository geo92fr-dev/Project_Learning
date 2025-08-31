// 🚀 FunLearning V2.0 - Phase 2 Export Index
// Configuration centralisée des exports pour Phase 2

// === LIB EXPORTS ===
// Exports principaux de la bibliothèque

// === UTILITIES ===
export { default as LoadingSpinner } from "./components/ui/LoadingSpinner.svelte";

// === STORES ===
// Plus d'authentification pour le moment

// === STORES ===
export {
  user,
  loading,
  error,
  isAuthenticated,
  initAuth,
  signIn,
  signUp,
  signInWithGoogle,
  signOut,
  resetPassword,
  clearError,
} from "./stores/auth";

// === UTILS ===
// À enrichir au fur et à mesure des phases

// 📋 Phase Status: ✅ Phase 1 - Setup basique conforme roadmap
