const models = require("../../database/models/");

const { User, Post, Comment, Like } = models;

interface postInterface {
  id?: string;
  title: string;
  message: string;
  tags?: string;
  track?: boolean;
  userId: number;
  username: string;
}

export const createPost = async (
  post: postInterface,
  id: number,
  username: string
) => {
  try {
    const posts = await Post.create({
      ...post,
      username,
      userId: Number(id),
    });
    return { status: "success", data: posts };
  } catch (error) {
    console.error(error);
    return { status: "error", error };
  }
};

export const getPosts = async () => {
  try {
    const posts = await Post.findAll({
      include: [User, Comment, Like],
    });
    return { status: "success", data: posts };
  } catch (error) {
    return { status: "error", error };
  }
};
export const getAPost = async (id: number) => {
  try {
    const post = await Post.findOne({
      where: { id },
      include: [User, Comment, Like],
    });
    return { status: "success", data: post };
  } catch (error) {
    return { status: "error", error };
  }
};
export const updatePost = async (post: postInterface) => {
  const findPost = await Post.findOne({
    where: { id: post.id },
  });
  try {
    if (findPost) {
      await Post.update(
        post,
        { where: { id: post.id } },
        {
          include: [User, Comment, Like],
        }
      );
    }
    return { status: "success", data: post };
  } catch (error) {
    return { status: "error", error };
  }
};
