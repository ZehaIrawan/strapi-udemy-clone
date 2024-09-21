import { createSection } from "./createSection";
import { createLecture } from "./createLecture";

export async function createCourseIfNotExists(strapi) {
  const courseData = {
    title: "Python Fundamentals",
    description:
      "Designed for beginners who want to learn the basics of Python programming.",
    slug: "python-fundamentals",
    thumbnail: "https://www.mooc.org/hubfs/python-applications.jpg",
    category: "Python",
    price: 12.99,
  };

  const existingCourse = await strapi.entityService.findMany(
    "api::course.course",
    {
      filters: { title: courseData.title },
    },
  );

  if (existingCourse.length === 0) {
    const course = await strapi.entityService.create("api::course.course", {
      data: courseData,
    });

    const section = await createSection({
      title: "Variables and Data Types",
      courseDocumentId: course.documentId,
      strapi,
    });

    const lecture = await createLecture({
      title: "Variables and Data Types",
      videoURL: "https://www.youtube.com/embed/XMu46BRPLqA",
      duration: 760,
      sectionDocumentId: section.documentId,
      strapi,
    });

    console.log("Course bootstrapped:", courseData.title);
  } else {
    console.log("Course already exists:", courseData.title);
  }
}
