const models = require("../../database/models/");

const { User, Post, Comment, Like } = models;

interface commentInterface {
  message: string;
  userId?: number;
  postId: number;
}

export const createComment = async (
  message: string,
  userId: number,
  postId: number
) => {
  try {
    // const comments = await Comment.create({
    //   ...message,
    //   userId: id,
    //   postId,
    // });

    console.log({ message });
    const findPost = await Post.findOne({ where: { id: postId } });
    if (findPost) {
      const comments = await Comment.create({
        message,
        userId,
        postId,
      });
      return { status: "success", comments };
    }
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
