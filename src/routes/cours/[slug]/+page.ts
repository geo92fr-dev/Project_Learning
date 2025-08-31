import { courseActions } from "$lib/stores/content.js";

export const load = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  // Sélectionne le cours par son slug
  courseActions.selectCourse(slug);

  return {
    slug,
  };
};
