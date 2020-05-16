const models = require("../../database/models/");

const { User, Post, Comment } = models;

interface historyInterface {
  message: string;
  userId?: number;
  postId: number;
}

export const createComment = async (
  message: historyInterface,
  id: number,
  postId: number
) => {
  try {
    const comments = await Comment.create({
      ...message,
      userId: id,
      postId,
    });
    return { status: "success", comments };
  } catch (error) {
    console.error(error);
    return { status: "error", error };
  }
};

export const getComments = async (id: number) => {
  try {
    const comments = await Comment.findAll({
      where: {
        postId: id,
      },
      include: [User, Post],
    });
    return { status: "success", comments };
  } catch (error) {
    return { status: "error", error };
  }
};
