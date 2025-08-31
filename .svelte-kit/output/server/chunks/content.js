import { d as derived, w as writable } from "./index2.js";
const courses = writable([]);
const currentCourse = writable(null);
const currentPage = writable(null);
const courseNavigation = writable(null);
const userProgress = writable([]);
const coursesByCategory = derived(courses, ($courses) => {
  return $courses.reduce((acc, course) => {
    const category = course.metadata.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(course);
    return acc;
  }, {});
});
derived(
  [currentCourse, userProgress],
  ([$currentCourse, $userProgress]) => {
    if (!$currentCourse)
      return null;
    return $userProgress.find((p) => p.courseId === $currentCourse.id) || null;
  }
);
const courseActions = {
  /**
   * Charge la liste des cours
   */
  loadCourses: (courseList) => {
    courses.set(courseList);
  },
  /**
   * Sélectionne un cours par son slug
   */
  selectCourse: (slug) => {
    courses.subscribe((courseList) => {
      const course = courseList.find((c) => c.slug === slug);
      currentCourse.set(course || null);
    })();
  },
  /**
   * Met à jour la navigation du cours
   */
  updateNavigation: (navigation) => {
    courseNavigation.set(navigation);
  },
  /**
   * Sélectionne une page du cours
   */
  selectPage: (page) => {
    currentPage.set(page);
  },
  /**
   * Met à jour la progression utilisateur
   */
  updateProgress: (progress) => {
    userProgress.update((progressList) => {
      const existingIndex = progressList.findIndex(
        (p) => p.userId === progress.userId && p.courseId === progress.courseId
      );
      if (existingIndex >= 0) {
        progressList[existingIndex] = progress;
      } else {
        progressList.push(progress);
      }
      return progressList;
    });
  },
  /**
   * Marque une page comme complétée
   */
  markPageCompleted: (userId, courseId, pageId) => {
    userProgress.update((progressList) => {
      const progress = progressList.find(
        (p) => p.userId === userId && p.courseId === courseId
      );
      if (progress && !progress.completedPages.includes(pageId)) {
        progress.completedPages.push(pageId);
        progress.lastAccessedAt = /* @__PURE__ */ new Date();
      }
      return progressList;
    });
  },
  /**
   * Remet à zéro les stores
   */
  reset: () => {
    courses.set([]);
    currentCourse.set(null);
    currentPage.set(null);
    courseNavigation.set(null);
    userProgress.set([]);
  }
};
export {
  currentCourse as a,
  courseActions as b,
  coursesByCategory as c
};
