/**
 * Firebase Utilities Test Suite - TDD Approach
 * Phase 5: Firebase Data Layer - Utilities Testing
 * 
 * @description Tests pour les utilitaires Firebase (converters, helpers, etc.)
 * @follows MyDevFramework CoPilot Best Practices + TDD
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type { DocumentData, QueryDocumentSnapshot, FirestoreDataConverter } from 'firebase/firestore';

// Import des utilitaires à implémenter (TDD: Test First)
import {
  createUserConverter,
  createCourseConverter,
  createCompetenceConverter,
  createUserProgressConverter,
  validateFirestoreData,
  validateURL,
  sanitizeUserInput,
  createTimestamp,
  generateDocumentId,
  COLLECTION_PATHS
} from '../utils';

// Mock Firestore types pour les tests
interface MockQueryDocumentSnapshot {
  id: string;
  data(): any;
  exists: boolean;
}

describe('Firebase Utilities - TDD', () => {

  describe('Firestore Data Converters', () => {
    
    describe('User Converter', () => {
      it('should convert Firestore document to User object', () => {
        const userConverter = createUserConverter();
        
        const mockSnapshot: MockQueryDocumentSnapshot = {
          id: 'user123',
          data: () => ({
            email: 'test@example.com',
            displayName: 'Test User',
            role: 'student',
            createdAt: '2025-09-01T10:00:00Z',
            lastLoginAt: '2025-09-01T10:00:00Z',
            preferences: {
              language: 'fr',
              theme: 'auto',
              notifications: {
                email: true,
                push: true,
                marketing: false
              },
              accessibility: {
                fontSize: 'medium',
                highContrast: false,
                reducedMotion: false
              }
            }
          }),
          exists: true
        };

        const user = userConverter.fromFirestore(mockSnapshot as any);
        
        expect(user).toBeDefined();
        expect(user.id).toBe('user123');
        expect(user.email).toBe('test@example.com');
        expect(user.displayName).toBe('Test User');
        expect(user.role).toBe('student');
        expect(user.preferences.language).toBe('fr');
      });

      it('should convert User object to Firestore data', () => {
        const userConverter = createUserConverter();
        
        const userData = {
          id: 'user123',
          email: 'test@example.com',
          displayName: 'Test User',
          role: 'student' as const,
          createdAt: '2025-09-01T10:00:00Z',
          lastLoginAt: '2025-09-01T10:00:00Z',
          preferences: {
            language: 'fr',
            theme: 'auto' as const,
            notifications: {
              email: true,
              push: true,
              marketing: false
            },
            accessibility: {
              fontSize: 'medium' as const,
              highContrast: false,
              reducedMotion: false
            }
          },
          learningProfile: {
            style: 'mixed' as const,
            difficultyPreference: 0.5,
            sessionDurationPreference: 30,
            learningGoals: [],
            interests: []
          },
          progressTracking: {
            totalTimeSpent: 0,
            coursesCompleted: 0,
            competencesAcquired: [],
            currentStreak: 0,
            longestStreak: 0
          },
          metadata: {
            version: '1.0',
            lastUpdated: '2025-09-01T10:00:00Z',
            isActive: true,
            gdprConsent: {
              functional: true,
              analytics: true,
              marketing: false,
              consentDate: '2025-09-01T10:00:00Z'
            }
          }
        };

        const firestoreData = userConverter.toFirestore(userData);
        
        expect(firestoreData).toBeDefined();
        expect(firestoreData.email).toBe('test@example.com');
        expect(firestoreData.displayName).toBe('Test User');
        expect(firestoreData.role).toBe('student');
        // Ne pas inclure l'id dans les données Firestore
        expect(firestoreData.id).toBeUndefined();
      });

      it('should handle missing optional fields gracefully', () => {
        const userConverter = createUserConverter();
        
        const mockSnapshot: MockQueryDocumentSnapshot = {
          id: 'user123',
          data: () => ({
            email: 'test@example.com',
            displayName: 'Test User',
            role: 'student',
            createdAt: '2025-09-01T10:00:00Z',
            lastLoginAt: '2025-09-01T10:00:00Z'
            // Champs optionnels manquants
          }),
          exists: true
        };

        const user = userConverter.fromFirestore(mockSnapshot as any);
        
        expect(user).toBeDefined();
        expect(user.preferences.language).toBe('fr'); // Valeur par défaut
        expect(user.learningProfile.style).toBe('mixed'); // Valeur par défaut
      });
    });

    describe('Course Converter', () => {
      it('should convert Firestore document to Course object', () => {
        const courseConverter = createCourseConverter();
        
        const mockSnapshot: MockQueryDocumentSnapshot = {
          id: 'course123',
          data: () => ({
            title: 'Test Course',
            description: 'A test course',
            category: 'mathematics',
            level: 'beginner',
            estimatedDuration: 120,
            language: 'fr',
            tags: ['math', 'basics'],
            competenceIds: ['comp1', 'comp2'],
            prerequisites: [],
            content: {
              modules: [{
                id: 'module1',
                title: 'Module 1',
                description: 'First module',
                order: 1,
                lessons: []
              }]
            },
            assessment: {
              passingScore: 0.7
            },
            analytics: {
              totalEnrollments: 0,
              completionRate: 0,
              totalRatings: 0
            },
            metadata: {
              authorId: 'author123',
              createdAt: '2025-09-01T10:00:00Z',
              updatedAt: '2025-09-01T10:00:00Z',
              version: '1.0',
              isPublished: false
            }
          }),
          exists: true
        };

        const course = courseConverter.fromFirestore(mockSnapshot as any);
        
        expect(course).toBeDefined();
        expect(course.id).toBe('course123');
        expect(course.title).toBe('Test Course');
        expect(course.level).toBe('beginner');
        expect(course.content.modules).toHaveLength(1);
      });
    });

    describe('User Progress Converter', () => {
      it('should convert progress document with composite ID', () => {
        const progressConverter = createUserProgressConverter();
        
        const mockSnapshot: MockQueryDocumentSnapshot = {
          id: 'user123-course456',
          data: () => ({
            userId: 'user123',
            courseId: 'course456',
            status: 'in_progress',
            score: 75,
            completed: false,
            lastAttempt: '2025-09-01T10:00:00Z'
          }),
          exists: true
        };

        const progress = progressConverter.fromFirestore(mockSnapshot as any);
        
        expect(progress).toBeDefined();
        expect(progress.id).toBe('user123-course456');
        expect(progress.userId).toBe('user123');
        expect(progress.courseId).toBe('course456');
        expect(progress.status).toBe('in_progress');
        expect(progress.score).toBe(75);
      });
    });
  });

  describe('Data Validation Utils', () => {
    
    describe('validateFirestoreData', () => {
      it('should validate user data against schema', () => {
        const validUserData = {
          id: 'user123',
          email: 'test@example.com',
          displayName: 'Test User',
          role: 'student',
          createdAt: '2025-09-01T10:00:00Z',
          lastLoginAt: '2025-09-01T10:00:00Z',
          preferences: {
            language: 'fr',
            theme: 'auto',
            notifications: {
              email: true,
              push: true,
              marketing: false
            },
            accessibility: {
              fontSize: 'medium',
              highContrast: false,
              reducedMotion: false
            }
          },
          learningProfile: {
            style: 'mixed',
            difficultyPreference: 0.5,
            sessionDurationPreference: 30,
            learningGoals: [],
            interests: []
          },
          progressTracking: {
            totalTimeSpent: 0,
            coursesCompleted: 0,
            competencesAcquired: [],
            currentStreak: 0,
            longestStreak: 0
          },
          metadata: {
            version: '1.0',
            lastUpdated: '2025-09-01T10:00:00Z',
            isActive: true,
            gdprConsent: {
              functional: true,
              analytics: true,
              marketing: false,
              consentDate: '2025-09-01T10:00:00Z'
            }
          }
        };

        const result = validateFirestoreData('user', validUserData);
        
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(expect.objectContaining(validUserData));
        }
      });

      it('should reject invalid user data', () => {
        const invalidUserData = {
          email: 'invalid-email', // Invalid format
          displayName: '', // Empty string
          role: 'invalid-role', // Invalid role
          createdAt: 'invalid-date', // Invalid date
          lastLoginAt: '2025-09-01T10:00:00Z'
        };

        const result = validateFirestoreData('user', invalidUserData);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBeDefined();
        }
      });

      it('should validate course data against schema', () => {
        const validCourseData = {
          id: 'course123',
          title: 'Test Course',
          description: 'A test course description',
          category: 'mathematics',
          level: 'beginner',
          estimatedDuration: 120,
          language: 'fr',
          tags: ['math', 'basics'],
          competenceIds: ['comp1'],
          prerequisites: [],
          content: {
            modules: [{
              id: 'module1',
              title: 'Module 1',
              description: 'Module description',
              order: 1,
              lessons: [{
                id: 'lesson1',
                title: 'Lesson 1',
                type: 'interactive',
                content: 'Lesson content',
                duration: 15,
                resources: []
              }]
            }]
          },
          assessment: {
            passingScore: 0.7,
            continuousAssessment: []
          },
          analytics: {
            totalEnrollments: 0,
            completionRate: 0,
            totalRatings: 0
          },
          metadata: {
            authorId: 'author123',
            createdAt: '2025-09-01T10:00:00Z',
            updatedAt: '2025-09-01T10:00:00Z',
            version: '1.0',
            isPublished: false
          }
        };

        const result = validateFirestoreData('course', validCourseData);
        
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Input Sanitization', () => {
    
    describe('sanitizeUserInput', () => {
      it('should remove potentially harmful scripts', () => {
        const maliciousInput = '<script>alert("XSS")</script>Hello World';
        const sanitized = sanitizeUserInput(maliciousInput);
        
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).not.toContain('alert');
        expect(sanitized).toContain('Hello World');
      });

      it('should preserve safe HTML formatting', () => {
        const safeInput = '<p>This is <strong>safe</strong> HTML</p>';
        const sanitized = sanitizeUserInput(safeInput);
        
        expect(sanitized).toContain('<p>');
        expect(sanitized).toContain('<strong>');
        expect(sanitized).toContain('safe');
      });

      it('should handle empty and null inputs', () => {
        expect(sanitizeUserInput('')).toBe('');
        expect(sanitizeUserInput(null as any)).toBe('');
        expect(sanitizeUserInput(undefined as any)).toBe('');
      });

      it('should limit input length', () => {
        const longInput = 'a'.repeat(10000);
        const sanitized = sanitizeUserInput(longInput, { maxLength: 1000 });
        
        expect(sanitized.length).toBeLessThanOrEqual(1000);
      });
    });
  });

  describe('Timestamp Utilities', () => {
    
    describe('createTimestamp', () => {
      it('should create valid ISO timestamp', () => {
        const timestamp = createTimestamp();
        
        expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(new Date(timestamp).getTime()).not.toBeNaN();
      });

      it('should create timestamp from Date object', () => {
        const date = new Date('2025-09-01T10:00:00Z');
        const timestamp = createTimestamp(date);
        
        expect(timestamp).toBe('2025-09-01T10:00:00.000Z');
      });

      it('should create timestamp for current time when no argument', () => {
        const before = Date.now();
        const timestamp = createTimestamp();
        const after = Date.now();
        
        const timestampMs = new Date(timestamp).getTime();
        expect(timestampMs).toBeGreaterThanOrEqual(before);
        expect(timestampMs).toBeLessThanOrEqual(after);
      });
    });
  });

  describe('Document ID Generation', () => {
    
    describe('generateDocumentId', () => {
      it('should generate unique user progress ID', () => {
        const userId = 'user123';
        const courseId = 'course456';
        const progressId = generateDocumentId('userProgress', { userId, courseId });
        
        expect(progressId).toBe('user123-course456');
      });

      it('should generate random ID for other collections', () => {
        const userId = generateDocumentId('user');
        const courseId = generateDocumentId('course');
        
        expect(userId).toBeDefined();
        expect(userId.length).toBeGreaterThan(10);
        expect(courseId).toBeDefined();
        expect(courseId.length).toBeGreaterThan(10);
        expect(userId).not.toBe(courseId); // Should be different
      });

      it('should generate assessment ID with timestamp', () => {
        const assessmentId = generateDocumentId('assessment', { 
          userId: 'user123', 
          courseId: 'course456' 
        });
        
        expect(assessmentId).toContain('user123');
        expect(assessmentId).toContain('course456');
        expect(assessmentId.length).toBeGreaterThan(20);
      });
    });
  });

  describe('Collection Path Constants', () => {
    
    it('should provide correct collection paths', () => {
      expect(COLLECTION_PATHS.USERS).toBe('users');
      expect(COLLECTION_PATHS.COURSES).toBe('courses');
      expect(COLLECTION_PATHS.COMPETENCES).toBe('competences');
      expect(COLLECTION_PATHS.USER_PROGRESS).toBe('userProgress');
      expect(COLLECTION_PATHS.ANALYTICS).toBe('analytics');
    });

    it('should provide subcollection path helpers', () => {
      const userNotificationsPath = COLLECTION_PATHS.getUserNotifications('user123');
      expect(userNotificationsPath).toBe('users/user123/notifications');
      
      const courseModulesPath = COLLECTION_PATHS.getCourseModules('course456');
      expect(courseModulesPath).toBe('courses/course456/modules');
    });
  });

  describe('Error Handling Utilities', () => {
    
    it('should handle Firestore errors gracefully', () => {
      // Test: Gestion d'erreurs Firestore
      expect(true).toBe(true); // Placeholder pour implémentation future
    });

    it('should provide user-friendly error messages', () => {
      // Test: Messages d'erreur utilisateur
      expect(true).toBe(true); // Placeholder pour implémentation future
    });
  });

  describe('Batch Operations', () => {
    
    it('should support batch writes with validation', () => {
      // Test: Opérations batch Firestore
      expect(true).toBe(true); // Placeholder pour implémentation future
    });

    it('should handle batch size limits', () => {
      // Test: Limites de taille batch
      expect(true).toBe(true); // Placeholder pour implémentation future
    });
  });

  // ===== URL VALIDATION TESTS (TDD) =====

  describe('URL Validation', () => {
    describe('validateURL', () => {
      it('should accept valid HTTPS URLs', () => {
        const validUrls = [
          'https://example.com',
          'https://subdomain.example.com/path?query=value',
          'https://lh3.googleusercontent.com/photo.jpg'
        ];
        
        validUrls.forEach(url => {
          const result = validateURL(url, { allowedProtocols: ['https:'] });
          expect(result.isValid).toBe(true);
          expect(result.error).toBeUndefined();
        });
      });

      it('should reject malicious URLs', () => {
        const maliciousUrls = [
          'javascript:alert("xss")',
          'data:text/html,<script>alert("xss")</script>',
          'ftp://malicious.com/file',
          'http://' + 'a'.repeat(3000) // URL trop longue
        ];
        
        maliciousUrls.forEach(url => {
          const result = validateURL(url);
          expect(result.isValid).toBe(false);
          expect(result.error).toBeDefined();
        });
      });

      it('should validate domain restrictions', () => {
        const allowedDomains = ['example.com', 'google.com'];
        
        // URL autorisée
        const validResult = validateURL('https://example.com/path', {
          allowedDomains
        });
        expect(validResult.isValid).toBe(true);

        // URL non autorisée
        const invalidResult = validateURL('https://malicious.com/path', {
          allowedDomains
        });
        expect(invalidResult.isValid).toBe(false);
        expect(invalidResult.error).toContain('Domaine non autorisé');
      });

      it('should handle malformed URLs', () => {
        const malformedUrls = [
          'not-a-url',
          'http://',
          '://missing-protocol.com',
          'https://[invalid-brackets'
        ];

        malformedUrls.forEach(url => {
          const result = validateURL(url);
          expect(result.isValid).toBe(false);
          expect(result.error).toBe('URL malformée');
        });
      });
    });
  });
});
