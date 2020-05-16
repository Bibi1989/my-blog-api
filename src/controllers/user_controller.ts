import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { genSalt } from "bcrypt";
const models = require("../../database/models/");
const { User, Url } = models;

interface userInterface {
  username: string;
  email: string;
  password: string;
}

export const createUsers = async (user: userInterface) => {
  const findUser = await User.findOne({
    where: {
      email: user.email,
    },
  });
  //   console.log();
  try {
    if (findUser) {
      return { status: "error", error: "User with this email exist" };
    }
    const salt = await genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const users = await User.create({
      ...user,
      hashedPassword,
    });
    const token = jwt.sign(
      {
        id: users.id,
        email: users.email,
        username: users.username,
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
      include: [Url],
    });
    return { status: "success", data: users };
  } catch (error) {
    return { status: "error", error };
  }
};
