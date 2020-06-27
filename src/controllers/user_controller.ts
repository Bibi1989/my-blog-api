import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";
import { Op } from "sequelize";
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

export const updateUser = async (id: number, body: any) => {
  console.log(body);
  try {
    let user = await User.findOne({ where: { id } });
    if (!user) return { status: "error", error: "User not found" };

    await User.update(body, { where: { id } });
    return { status: "success", data: "User updated successfully!!!" };
  } catch (error) {
    return { status: "error", error };
  }
};

export const deleteUser = async (id: number) => {
  try {
    await User.destroy({ where: { id } });
    return { status: "success", data: "User deactivated!!!" };
  } catch (error) {
    return { status: "error", error };
  }
};

export const resetPassword = async (email: any, req: any) => {
  const user = await User.findOne({ where: { email } });
  try {
    if (!user) {
      return { status: "error", error: "User with this email not found" };
    }

    let resetToken = crypto.randomBytes(20).toString("hex");

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    let resetPasswordExpired: any = Date.now() + 10 * 60 * 1000;

    const createLink = `${req.protocol}://${req.get(
      "host"
    )}/auth/v1/resetpassword/${resetToken}`;
    console.log({ createLink });

    let message = `You requested to reset your password click this link to create new password`;

    const options = {
      email,
      subject: "Change your password",
      message,
      resetUrl: createLink,
    };

    sendEmail(options);

    await User.update(
      { ...user, resetPasswordToken, resetPasswordExpired },
      { where: { id: user.id } }
    );
    return { status: "success", data: user };
  } catch (error) {
    return { status: "error", error: error };
  }
};

export const getToken = async (token: string) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      where: {
        [Op.and]: [
          { resetPasswordToken, resetPasswordExpired: { [Op.gt]: Date.now() } },
        ],
      },
    });

    if (!user) {
      return { status: "error", error: "User not found" };
    }

    return { status: "success", id: user.id };
  } catch (error) {
    return { status: "error", error };
  }
};

export const changePassword = async (password: any, token: string) => {
  try {
    let resetPasswordTk = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      where: {
        resetPasswordToken: resetPasswordTk,
      },
    });

    if (!user) {
      return { status: "error", error: "User not found" };
    }

    if (!password) {
      return { status: "error", error: "No password provided" };
    }
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password.password, salt);
    let obj: any = {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpired: null,
    };
    await User.update(obj, {
      where: {
        id: Number(user.id),
      },
    });
    return { status: "success", data: "Password changed" };
  } catch (error) {
    return { status: "error", error };
  }
};
