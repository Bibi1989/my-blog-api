const models = require("../../database/models/");

const { User, Post, Comment, Like } = models;

interface postInterface {
  id?: string;
  title: string;
  message: string;
  image_url?: string;
  tags?: string;
  track?: boolean;
  userId: number;
  username: string;
}

export const createPost = async (
  post: postInterface,
  id: number,
  username: string,
  image_url: string
) => {
  try {
    const posts = await Post.create({
      ...post,
      username,
      image_url,
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
export const getUsersPost = async (id: number) => {
  try {
    const post = await Post.findAll({
      where: { userId: id },
      include: [User, Comment, Like],
    });
    return { status: "success", data: post };
  } catch (error) {
    return { status: "error", error };
  }
};
export const updatePost = async (
  post: postInterface,
  title: string,
  message: string
) => {
  const findPost = await Post.findOne({
    where: { id: post.id },
  });
  try {
    if (findPost) {
      await Post.update(
        { ...post, title, message },
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
export const deletePost = async (id: number) => {
  const findPost = await Post.findOne({
    where: { id },
  });
  try {
    if (findPost) {
      await Post.destroy({ where: { id } });
    }
    return { status: "success", data: "Post deleted!!!" };
  } catch (error) {
    return { status: "error", error };
  }
};
