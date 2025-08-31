import { b as courseActions } from "../../../../chunks/content.js";
const load = async ({ params }) => {
  const { slug } = params;
  courseActions.selectCourse(slug);
  return {
    slug
  };
};
export {
  load
};
