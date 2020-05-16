import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const models = require("../../database/models/");
const { User, Post } = models;

interface userInterface {
  username: string;
  email: string;
  password: string;
  image_url?: string;
}

export const createUsers = async (user: userInterface) => {
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
