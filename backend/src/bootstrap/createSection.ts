export async function createSection({ title,courseDocumentId, strapi }) {

  try {
    const section = await strapi.entityService.create("api::section.section", {
      data: {
        title: title,
        course: {
          connect: [courseDocumentId]
        }
      },
    });

    return section;
  } catch (error) {
    console.log(error);
  }
}
