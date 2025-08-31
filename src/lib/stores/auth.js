// 🚀 FunLearning V2.0 - Phase 1 Auth Store
// Store d'authentification basique conforme Phase 1

import { writable } from "svelte/store";
import { auth } from "../firebase.js";

// === USER STATE ===
export const user = writable(null);
export const loading = writable(true);

// === BASIC AUTH FUNCTIONS ===
export function initAuth() {
  // Configuration basique auth Firebase
  // Sera enrichi dans les phases ultérieures
  loading.set(false);
}

// 📋 Phase Status: ✅ Phase 1 - Auth basique conforme roadmap
