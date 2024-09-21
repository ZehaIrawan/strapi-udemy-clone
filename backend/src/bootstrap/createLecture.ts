export async function createLecture({ title,videoURL, duration, sectionDocumentId, strapi }) {
  try {
    await strapi.entityService.create("api::lecture.lecture", {
      data: {
        title: title,
        videoURL: videoURL,
        duration: duration,
        section: {
          connect: [sectionDocumentId],
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
}
