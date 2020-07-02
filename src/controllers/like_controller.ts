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
    const findPost = await Like.findOne({ where: { postId, userId } });
    if (!findPost) {
      const like = await Like.create({
        message: `${username} liked your post`,
        userId,
        postId,
        username,
      });
      return { status: "success", like };
    } else {
      await Like.destroy({ where: { postId, userId } });
      return { status: "error", message: "Post not found" };
    }
  } catch (error) {
    console.error(error);
    return { status: "error", error };
  }
};

export const getLikes = async (id: number) => {
  try {
    const likes = await Like.findAll({
      where: {
        id,
      },
      include: [User, Post],
    });
    return { status: "success", likes, likeCount: likes.length };
  } catch (error) {
    return { status: "error", error };
  }
};
