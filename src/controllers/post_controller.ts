import { v2 } from "cloudinary";
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

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createPost = async (
  post: postInterface,
  id: number,
  username: string
) => {
  try {
    let errors = {
      title: "",
      message: "",
    };
    if (!post.title) {
      errors.title = "Title is required";
    }
    if (!post.message) {
      errors.message = "Message Body is required";
    }

    if (errors.title || errors.message) {
      return { status: "error", statusCode: 404, error: errors };
    }

    const check = await Post.findOne({
      where: {
        title: post.title,
        userId: id,
      },
    });

    if (check) {
      return {
        status: "error",
        statusCode: 404,
        error: "You have used this title already",
      };
    }

    const posts = await Post.create({
      ...post,
      username,
      userId: Number(id),
    });
    const findPost = await Post.findOne({
      where: { id: posts.id },
      include: [User, Comment, Like],
    });
    return { status: "success", data: findPost };
  } catch (error) {
    console.error(error);
    return { status: "error", statusCode: 400, error };
  }
};

export const postImage = async (
  form: any,
  id: number,
  username: string,
  req: any
) => {
  try {
    const img = await v2.uploader.upload(
      req.files.image.tempFilePath,
      { folder: "blog" },
      (err: Error, result: any) => {
        if (err) {
          console.log(err);
        }
        return result;
      }
    );

    const posts = await Post.create({
      ...form,
      image_url: img.secure_url,
      username,
      userId: Number(id),
    });

    return { status: "success", data: posts };
  } catch (error) {
    return { status: "error", statusCode: 400, error };
  }
};

export const getPosts = async (page: number, limit: number) => {
  try {
    let startIndex = (page - 1) * limit;
    let lastIndex = page * limit;

    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]],
      limit,
      offset: startIndex,
      include: [User, Comment, Like],
    });

    const paginate: {
      hasMore: boolean;
      next?: number;
      prev?: number;
      count: number;
    } = {
      hasMore: false,
      count: 0,
    };

    const count = await Post.count();

    const hasMore = lastIndex < count;

    const hasLess = startIndex >= limit;

    if (hasMore) {
      paginate.next = hasMore && page + 1;
    }

    if (hasLess) {
      paginate.prev = hasLess && page - 1;
    }

    paginate.hasMore = hasMore;
    paginate.count = count;

    return { status: "success", paginate, data: posts };
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
