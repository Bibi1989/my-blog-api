const models = require("../../database/models/");

const { User, Post, Comment, Like } = models;

interface postInterface {
  id?: string;
  title: string;
  message: string;
  tags?: string;
  track?: boolean;
  userId?: number;
}

export const createLinks = async (post: postInterface, id: number) => {
  try {
    const posts = await Post.create({
      ...post,
      userId: Number(id),
    });
    return { status: "success", data: posts };
  } catch (error) {
    console.error(error);
    return { status: "error", error };
  }
};

export const getLinks = async () => {
  try {
    const posts = await Post.findAll({
      include: [User, Comment, Like],
    });
    return { status: "success", data: posts };
  } catch (error) {
    return { status: "error", error };
  }
};
