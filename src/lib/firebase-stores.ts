// 🔐 Firebase Stores - Minimal Version
// Stores Firestore temporaires pour éviter les erreurs de cache

import { writable } from "svelte/store";
import type {
  UserProfile,
  Course,
  UserProgress,
  Competence,
} from "../collections";

// === STORES TEMPORAIRES ===
export const users = writable<UserProfile[]>([]);
export const courses = writable<Course[]>([]);
export const userProgress = writable<UserProgress[]>([]);
export const competences = writable<Competence[]>([]);
export const completedCoursesStore = writable<Course[]>([]);

// === STORES AUTH MANQUANTS ===
export const authInfoStore = writable<{
  isAuthenticated: boolean | null;
  user: { uid: string; email: string } | null;
}>({ isAuthenticated: null, user: null });
export const userStore = writable(null);
export const authStateStore = writable("loading");
export const userProfileStore = writable<UserProfile | null>(null);
export const userProgressStore = writable<Map<string, UserProgress> | null>(
  null
);
export const coursesStore = writable<Course[]>([]);
export const currentCoursesStore = writable<Course[]>([]);
export const userStatsStore = writable<{
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  averageScore: number;
  totalTimeSpent: number;
} | null>(null);

// === FONCTIONS TEMPORAIRES ===
export async function createUser(userData: any) {
  console.log("🔧 createUser temporaire:", userData);
  return { success: true };
}

export async function getUserCourses(userId: string) {
  console.log("🔧 getUserCourses temporaire:", userId);
  return [];
}

export async function initializeFirebaseStores() {
  console.log("🔧 initializeFirebaseStores temporaire");
  return { success: true };
}

export async function updateUser(userId: string, userData: any) {
  console.log("🔧 updateUser temporaire:", userId, userData);
  return { success: true };
}

export async function deleteUser(userId: string) {
  console.log("🔧 deleteUser temporaire:", userId);
  return { success: true };
}

export async function getCourses() {
  console.log("🔧 getCourses temporaire");
  return [];
}

export async function getCourse(courseId: string) {
  console.log("🔧 getCourse temporaire:", courseId);
  return null;
}

export async function getUserProgress() {
  console.log("🔧 getUserProgress temporaire");
  return [];
}

export async function updateUserProgress(
  progressId: string,
  progressData: any
) {
  console.log("🔧 updateUserProgress temporaire:", progressId, progressData);
  return { success: true };
}

export async function createUserProfile(profileData: any) {
  console.log("🔧 createUserProfile temporaire:", profileData);
  return { success: true, error: null };
}

export async function updateUserProfile(userId: string, profileData: any) {
  console.log("🔧 updateUserProfile temporaire:", userId, profileData);
  return { success: true, error: null };
}

export async function getUserProgressByCourse(
  userId: string,
  courseId: string
) {
  console.log("🔧 getUserProgressByCourse temporaire:", userId, courseId);
  return [];
}

export async function getCompetences() {
  console.log("🔧 getCompetences temporaire");
  return [];
}

export function subscribeToUserProgress(
  userId: string,
  callback: (progress: any) => void
) {
  console.log("🔧 subscribeToUserProgress temporaire:", userId);
  // Simulate subscription
  setTimeout(() => callback(new Map()), 100);
  return () => console.log("🔧 Unsubscribe temporaire");
}

// 📋 Fichier temporaire pour éviter les erreurs de cache Firebase
