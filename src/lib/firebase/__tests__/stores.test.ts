/**
 * Firebase Stores Test Suite - TDD Frontend Integration
 * Phase 5B: Frontend Integration - Store Testing
 *
 * @description Tests pour les stores Svelte Firebase
 * @follows MyDevFramework CoPilot Best Practices + TDD
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { get } from "svelte/store";

// Mock Firebase modules
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => ({ withConverter: vi.fn(() => ({})) })),
  doc: vi.fn(() => ({ withConverter: vi.fn(() => ({})) })),
  getDoc: vi.fn(() =>
    Promise.resolve({ exists: () => true, data: () => ({}) })
  ),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  onSnapshot: vi.fn(() => vi.fn()),
  query: vi.fn(() => ({})),
  where: vi.fn(() => ({})),
  orderBy: vi.fn(() => ({})),
  limit: vi.fn(() => ({})),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(() => vi.fn()),
}));

// Mock config module
vi.mock("../config", () => ({
  getAuth: vi.fn(() => ({})),
  getDb: vi.fn(() => ({})),
  getApp: vi.fn(() => ({})),
}));

// Mock utils module
vi.mock("../utils", () => ({
  createUserConverter: vi.fn(() => ({
    toFirestore: vi.fn(),
    fromFirestore: vi.fn(),
  })),
  createCourseConverter: vi.fn(() => ({
    toFirestore: vi.fn(),
    fromFirestore: vi.fn(),
  })),
  createUserProgressConverter: vi.fn(() => ({
    toFirestore: vi.fn(),
    fromFirestore: vi.fn(),
  })),
  createCompetenceConverter: vi.fn(() => ({
    toFirestore: vi.fn(),
    fromFirestore: vi.fn(),
  })),
  validateFirestoreData: vi.fn(() => ({ success: true })),
  createTimestamp: vi.fn(() => new Date()),
  generateDocumentId: vi.fn(() => "test-id"),
  COLLECTION_PATHS: {
    USERS: "users",
    COURSES: "courses",
    USER_PROGRESS: "progress",
    COMPETENCES: "competences",
  },
  handleFirestoreOperation: vi.fn(async (op) => ({
    success: true,
    data: await op(),
  })),
}));

// Import stores after mocks
import {
  userProfileStore,
  coursesStore,
  userProgressStore,
  competences,
  userStore,
  createUserProfile,
  updateUserProfile,
  getUserCourses,
  updateUserProgress,
  subscribeToUserProgress,
} from "../stores/firebase-stores";

describe("Firebase Stores - TDD Integration", () => {
  beforeEach(() => {
    userProfileStore.set(null);
    coursesStore.set([]);
    userProgressStore.set(new Map());
    competences.set([]);
    userStore.set(null);
    vi.clearAllMocks();
  });

  describe("User Profile Store", () => {
    it("should initialize with null", () => {
      expect(get(userProfileStore)).toBeNull();
    });

    it("should update when profile is set", () => {
      const mockProfile = {
        id: "user1",
        email: "test@example.com",
        displayName: "Test User",
        role: "student" as const,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        preferences: {
          language: "fr",
          theme: "auto" as const,
          notifications: { email: true, push: true, marketing: false },
          accessibility: {
            fontSize: "medium" as const,
            highContrast: false,
            reducedMotion: false,
          },
        },
        learningProfile: {
          style: "mixed" as const,
          difficultyPreference: 0.5,
          sessionDurationPreference: 30,
          learningGoals: [],
          interests: [],
        },
        progressTracking: {
          totalTimeSpent: 0,
          coursesCompleted: 0,
          competencesAcquired: [],
          currentStreak: 0,
          longestStreak: 0,
        },
        metadata: {
          version: "1.0",
          lastUpdated: new Date().toISOString(),
          isActive: true,
          gdprConsent: {
            functional: true,
            analytics: false,
            marketing: false,
            consentDate: new Date().toISOString(),
          },
        },
      };

      userProfileStore.set(mockProfile);
      expect(get(userProfileStore)).toEqual(mockProfile);
    });
  });

  describe("Courses Store", () => {
    it("should initialize with empty array", () => {
      expect(get(coursesStore)).toEqual([]);
    });

    it("should store courses when set", () => {
      const mockCourses = [
        {
          id: "course1",
          title: "Test Course",
          description: "A test course",
          category: "programming",
          level: "beginner" as const,
          estimatedDuration: 60,
          language: "fr",
          tags: ["test"],
          competenceIds: ["comp1"],
          prerequisites: [],

          content: {
            modules: [],
          },

          assessment: {
            preAssessment: undefined,
            postAssessment: undefined,
            continuousAssessment: [],
            passingScore: 0.7,
          },

          analytics: {
            totalEnrollments: 100,
            completionRate: 0.8,
            totalRatings: 25,
            averageRating: 4.2,
          },

          metadata: {
            authorId: "author1",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: "1.0",
            isPublished: true,
            publishedAt: new Date().toISOString(),
          },
        },
      ];

      coursesStore.set(mockCourses);
      expect(get(coursesStore)).toEqual(mockCourses);
    });
  });

  describe("User Progress Store", () => {
    it("should initialize with empty Map", () => {
      const progress = get(userProgressStore);
      expect(progress).toBeInstanceOf(Map);
      expect(progress?.size).toBe(0);
    });

    it("should store progress when set", () => {
      const mockProgress = new Map();
      mockProgress.set("course1", {
        id: "progress1",
        userId: "user1",
        courseId: "course1",
        status: "in_progress" as const,
        score: 75,
        completed: false,
        startedAt: new Date().toISOString(),
        lastAttempt: new Date().toISOString(),
        timeSpent: 30,
        completedLessons: ["lesson1"],
        attempts: 1,
        metadata: {
          version: "1.0",
          lastUpdated: new Date().toISOString(),
        },
      });

      userProgressStore.set(mockProgress);
      const stored = get(userProgressStore);
      expect(stored?.size).toBe(1);
      expect(stored?.get("course1")?.score).toBe(75);
    });
  });

  describe("Store Functions", () => {
    it("should create user profile successfully", async () => {
      const profileData = {
        email: "test@example.com",
        displayName: "Test User",
        role: "student" as const,
      };

      // Mock will handle the operation
      const result = await createUserProfile(profileData);
      expect(result).toBeDefined();
    });

    it("should update user profile successfully", async () => {
      const userId = "user123";
      const updates = { displayName: "Updated Name" };

      const result = await updateUserProfile(userId, updates);
      expect(result.success).toBe(true);
    });

    it("should get user courses", async () => {
      const userId = "user123";
      const courses = await getUserCourses(userId);
      expect(Array.isArray(courses)).toBe(true);
    });

    it("should update user progress", async () => {
      const progressId = "progress123";
      const progressData = {
        userId: "user123",
        courseId: "course1",
        score: 85,
        status: "completed" as const,
        completed: true,
      };

      const result = await updateUserProgress(progressId, progressData);
      expect(result.success).toBe(true);
    });

    it("should subscribe to user progress", () => {
      const userId = "user123";
      const callback = vi.fn();

      const unsubscribe = subscribeToUserProgress(userId, callback);
      expect(typeof unsubscribe).toBe("function");

      unsubscribe();
    });
  });

  describe("Error Handling", () => {
    it("should handle Firebase errors gracefully", async () => {
      // Mock error
      const utils = await import("../utils");
      vi.mocked(utils.handleFirestoreOperation).mockResolvedValueOnce({
        success: false,
        error: "Network error",
      });

      const courses = await getUserCourses("user123");
      expect(Array.isArray(courses)).toBe(true);
      expect(courses.length).toBe(0);
    });
  });
});
