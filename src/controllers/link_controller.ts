const models = require("../../database/models/");

const { User, Url } = models;

interface linksInterface {
  title: string;
  link: string;
  userId?: number;
}

export const createLinks = async (link: linksInterface, id: number) => {
  const findLink = await Url.findOne({
    where: {
      title: link.title,
    },
  });
  if (findLink) {
    return {
      status: "error",
      error: "You have add this link already, you can update it",
    };
  }
  try {
    const links = await Url.create({
      ...link,
      userId: Number(id),
    });
    return { status: "success", data: links };
  } catch (error) {
    console.error(error);
    return { status: "error", error };
  }
};

export const getLinks = async () => {
  try {
    const links = await Url.findAll({
      include: [User],
    });
    return { status: "success", data: links };
  } catch (error) {
    return { status: "error", error };
  }
};
