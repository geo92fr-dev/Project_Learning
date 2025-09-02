/**
 * 🔄 Curriculum Service - Phase 6
 * Service principal pour la gestion du curriculum et des compétences
 */

import type { Competence, Course, UserProgress } from '../types/curriculum';

// Import des données générées
import competencesData from '../data/competences.json';
import coursesData from '../data/courses.json';

export interface CurriculumFilter {
  matiere?: string;
  niveau?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  type?: 'lesson' | 'exercises';
}

export interface CurriculumSearchOptions {
  query?: string;
  filters?: CurriculumFilter;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'difficulty' | 'estimatedTime' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

class CurriculumService {
  private competences: Competence[];
  private courses: Course[];
  private initialized = false;

  constructor() {
    this.competences = [];
    this.courses = [];
  }

  /**
   * Initialise le service avec les données
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Charger les données JSON
      this.competences = competencesData as Competence[];
      this.courses = coursesData as Course[];
      
      this.initialized = true;
      console.log(`📚 CurriculumService initialisé: ${this.competences.length} compétences, ${this.courses.length} cours`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du CurriculumService:', error);
      throw new Error('Failed to initialize CurriculumService');
    }
  }

  /**
   * Récupère toutes les compétences
   */
  async getAllCompetences(): Promise<Competence[]> {
    await this.initialize();
    return [...this.competences];
  }

  /**
   * Récupère tous les cours
   */
  async getAllCourses(): Promise<Course[]> {
    await this.initialize();
    return [...this.courses];
  }

  /**
   * Recherche des compétences avec filtres
   */
  async searchCompetences(options: CurriculumSearchOptions = {}): Promise<{
    competences: Competence[];
    total: number;
    hasMore: boolean;
  }> {
    await this.initialize();

    let filtered = [...this.competences];

    // Appliquer les filtres
    if (options.filters) {
      filtered = this.applyFilters(filtered, options.filters);
    }

    // Appliquer la recherche textuelle
    if (options.query) {
      filtered = this.applyTextSearch(filtered, options.query);
    }

    // Tri
    if (options.sortBy) {
      filtered = this.sortCompetences(filtered, options.sortBy, options.sortOrder || 'asc');
    }

    // Pagination
    const total = filtered.length;
    const offset = options.offset || 0;
    const limit = options.limit || 50;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      competences: paginated,
      total,
      hasMore: offset + limit < total
    };
  }

  /**
   * Recherche des cours avec filtres
   */
  async searchCourses(options: CurriculumSearchOptions = {}): Promise<{
    courses: Course[];
    total: number;
    hasMore: boolean;
  }> {
    await this.initialize();

    let filtered = [...this.courses];

    // Appliquer les filtres
    if (options.filters) {
      filtered = this.applyCoursesFilters(filtered, options.filters);
    }

    // Appliquer la recherche textuelle
    if (options.query) {
      filtered = this.applyCoursesTextSearch(filtered, options.query);
    }

    // Tri
    if (options.sortBy) {
      filtered = this.sortCourses(filtered, options.sortBy, options.sortOrder || 'asc');
    }

    // Pagination
    const total = filtered.length;
    const offset = options.offset || 0;
    const limit = options.limit || 20;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      courses: paginated,
      total,
      hasMore: offset + limit < total
    };
  }

  /**
   * Récupère une compétence par ID
   */
  async getCompetenceById(id: string): Promise<Competence | null> {
    await this.initialize();
    return this.competences.find(comp => comp.id === id) || null;
  }

  /**
   * Récupère un cours par ID
   */
  async getCourseById(id: string): Promise<Course | null> {
    await this.initialize();
    return this.courses.find(course => course.id === id) || null;
  }

  /**
   * Récupère les cours d'une compétence
   */
  async getCoursesByCompetence(competenceId: string): Promise<Course[]> {
    await this.initialize();
    return this.courses.filter(course => course.competenceId === competenceId);
  }

  /**
   * Récupère les compétences prérequises
   */
  async getPrerequisites(competenceId: string): Promise<Competence[]> {
    await this.initialize();
    const competence = await this.getCompetenceById(competenceId);
    
    if (!competence || !competence.prerequis?.length) {
      return [];
    }

    const prerequisites = [];
    for (const prereqId of competence.prerequis) {
      const prereq = await this.getCompetenceById(prereqId);
      if (prereq) {
        prerequisites.push(prereq);
      }
    }

    return prerequisites;
  }

  /**
   * Récupère les cours recommandés pour un utilisateur
   */
  async getRecommendedCourses(
    userLevel: string = 'beginner',
    userProgress: UserProgress[] = [],
    limit: number = 10
  ): Promise<Course[]> {
    await this.initialize();

    // Cours déjà complétés
    const completedCourseIds = userProgress
      .filter(p => p.completed)
      .map(p => p.courseId);

    // Filtrer les cours non complétés
    const availableCourses = this.courses.filter(course => 
      !completedCourseIds.includes(course.id) &&
      course.published &&
      this.matchesUserLevel(course, userLevel)
    );

    // Prioriser les cours featuredwh
    const featured = availableCourses.filter(course => course.featured);
    const regular = availableCourses.filter(course => !course.featured);

    // Combiner et limiter
    const recommended = [...featured, ...regular].slice(0, limit);

    return recommended;
  }

  /**
   * Statistiques du curriculum
   */
  async getStats(): Promise<{
    competences: {
      total: number;
      byMatiere: Record<string, number>;
      byNiveau: Record<string, number>;
      byDifficulty: Record<string, number>;
    };
    courses: {
      total: number;
      byType: Record<string, number>;
      totalEstimatedTime: number;
      averageDuration: number;
    };
  }> {
    await this.initialize();

    const competencesByMatiere: Record<string, number> = {};
    const competencesByNiveau: Record<string, number> = {};
    const competencesByDifficulty: Record<string, number> = {};

    this.competences.forEach(comp => {
      // Par matière
      competencesByMatiere[comp.matiere] = (competencesByMatiere[comp.matiere] || 0) + 1;
      
      // Par niveau
      competencesByNiveau[comp.niveau] = (competencesByNiveau[comp.niveau] || 0) + 1;
      
      // Par difficulté
      competencesByDifficulty[comp.difficulty] = (competencesByDifficulty[comp.difficulty] || 0) + 1;
    });

    const coursesByType: Record<string, number> = {};
    let totalEstimatedTime = 0;

    this.courses.forEach(course => {
      coursesByType[course.type] = (coursesByType[course.type] || 0) + 1;
      totalEstimatedTime += course.estimatedTime || course.duration || 0;
    });

    return {
      competences: {
        total: this.competences.length,
        byMatiere: competencesByMatiere,
        byNiveau: competencesByNiveau,
        byDifficulty: competencesByDifficulty
      },
      courses: {
        total: this.courses.length,
        byType: coursesByType,
        totalEstimatedTime,
        averageDuration: totalEstimatedTime / this.courses.length || 0
      }
    };
  }

  // Méthodes privées utilitaires

  private applyFilters(competences: Competence[], filters: CurriculumFilter): Competence[] {
    return competences.filter(comp => {
      if (filters.matiere && comp.matiere !== filters.matiere) return false;
      if (filters.niveau && comp.niveau !== filters.niveau) return false;
      if (filters.difficulty && comp.difficulty !== filters.difficulty) return false;
      return true;
    });
  }

  private applyCoursesFilters(courses: Course[], filters: CurriculumFilter): Course[] {
    return courses.filter(course => {
      if (filters.matiere && course.matiere !== filters.matiere) return false;
      if (filters.niveau && course.niveau !== filters.niveau) return false;
      if (filters.difficulty && course.difficulty !== filters.difficulty) return false;
      if (filters.type && course.type !== filters.type) return false;
      return true;
    });
  }

  private applyTextSearch(competences: Competence[], query: string): Competence[] {
    const searchTerm = query.toLowerCase();
    return competences.filter(comp =>
      comp.name.toLowerCase().includes(searchTerm) ||
      comp.description.toLowerCase().includes(searchTerm) ||
      comp.matiereDisplay.toLowerCase().includes(searchTerm)
    );
  }

  private applyCoursesTextSearch(courses: Course[], query: string): Course[] {
    const searchTerm = query.toLowerCase();
    return courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm)
    );
  }

  private sortCompetences(
    competences: Competence[], 
    sortBy: string, 
    order: 'asc' | 'desc'
  ): Competence[] {
    return competences.sort((a, b) => {
      let aVal: any = a[sortBy as keyof Competence];
      let bVal: any = b[sortBy as keyof Competence];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private sortCourses(courses: Course[], sortBy: string, order: 'asc' | 'desc'): Course[] {
    return courses.sort((a, b) => {
      let aVal: any = a[sortBy as keyof Course];
      let bVal: any = b[sortBy as keyof Course];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private matchesUserLevel(course: Course, userLevel: string): boolean {
    const levelPriority = {
      'beginner': ['beginner'],
      'intermediate': ['beginner', 'intermediate'],
      'advanced': ['beginner', 'intermediate', 'advanced'],
      'expert': ['beginner', 'intermediate', 'advanced', 'expert']
    };

    return levelPriority[userLevel as keyof typeof levelPriority]?.includes(course.difficulty) || false;
  }
}

// Instance singleton
export const curriculumService = new CurriculumService();

export default CurriculumService;
