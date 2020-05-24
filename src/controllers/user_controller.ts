import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const models = require("../../database/models/");
const { User, Post, Comment, Like } = models;

interface userInterface {
  username: string;
  email: string;
  password: string;
  image_url?: string;
}

export const createUsers = async (user: userInterface) => {
  if (!user.username) return { status: "error", error: "Username is empty!!!" };
  if (!user.email) return { status: "error", error: "Email is empty!!!" };
  if (!user.password) return { status: "error", error: "Password is empty!!!" };
  const findUser = await User.findOne({
    where: {
      email: user.email,
    },
  });
  try {
    if (findUser) {
      return { status: "error", error: "User with this email exist" };
    }
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    console.log(hashedPassword);
    const users = await User.create({
      ...user,
      image_url: user.image_url == "[]" ? null : user.image_url,
      password: hashedPassword,
    });
    const token = jwt.sign(
      {
        id: users.id,
        email: users.email,
        username: users.username,
        image_url: users.image_url,
      },
      process.env.SECRET_KEY
    );
    return { status: "success", data: users, token };
  } catch (error) {
    console.error(error);
    return { status: "error", error };
  }
};

export const getUsers = async () => {
  try {
    const users = await User.findAll({
      include: [Post],
    });
    return { status: "success", data: users };
  } catch (error) {
    return { status: "error", error };
  }
};
export const getUser = async (id: number) => {
  try {
    const user = await User.findOne({
      where: { id },
      include: [Post, Comment, Like],
    });
    return { status: "success", data: user };
  } catch (error) {
    return { status: "error", error };
  }
};

export const loginUser = async (user: any) => {
  if (!user.email) return { status: "error", error: "Email is empty!!!" };
  if (!user.password) return { status: "error", error: "Password is empty!!!" };
  const findUser = await User.findOne({
    where: {
      email: user.email,
    },
  });
  if (!findUser)
    return { status: "error", error: "Invalid email or your yet to register" };
  try {
    const isMatchPassword = await bcrypt.compare(
      user.password,
      findUser.dataValues.password
    );
    if (isMatchPassword) {
      const token = jwt.sign(
        {
          id: findUser.dataValues.id,
          email: findUser.dataValues.email,
          username: findUser.dataValues.username,
          image_url: findUser.dataValues.image_url,
        },
        process.env.SECRET_KEY
      );
      return { status: "success", data: findUser.dataValues, token };
    } else {
      return { status: "error", error: "password is invalid" };
    }
  } catch (error) {}
};

export const deleteUser = async (id: number) => {
  try {
    await User.destroy({ where: { id } });
    return { status: "success", data: "User deactivated!!!" };
  } catch (error) {
    return { status: "error", error };
  }
};
