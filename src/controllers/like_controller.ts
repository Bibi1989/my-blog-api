const models = require("../../database/models/");

const { User, Post, Comment, Like } = models;

interface commentInterface {
  message: string;
  username: string;
  userId?: number;
  postId: number;
}

export const createLike = async (
  userId: number,
  postId: number,
  username: string
) => {
  try {
    const findPost = await Like.findOne({ where: { userId, postId } });
    if (!findPost) {
      const like = await Like.create({
        message: `${username} liked your post`,
        userId,
        postId,
        username,
      });
      return { status: "success", like };
    }
    await Like.destroy({ where: { userId } });
    return { status: "error", message: "Post not found" };
  } catch (error) {
    console.error(error);
    return { status: "error", error };
  }
};

export const getComments = async (postId: number) => {
  try {
    const comments = await Comment.findAll({
      where: {
        postId,
      },
      include: [User, Post],
    });
    return { status: "success", comments };
  } catch (error) {
    return { status: "error", error };
  }
};
