"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = require("../utils/sendEmail");
const sequelize_1 = require("sequelize");
const models = require("../../database/models/");
const { User, Post, Comment, Like } = models;
exports.createUsers = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user.username)
        return { status: "error", error: "Username is empty!!!" };
    if (!user.email)
        return { status: "error", error: "Email is empty!!!" };
    if (!user.password)
        return { status: "error", error: "Password is empty!!!" };
    const findUser = yield User.findOne({
        where: {
            email: user.email,
        },
    });
    try {
        if (findUser) {
            return { status: "error", error: "User with this email exist" };
        }
        const salt = yield bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = yield bcryptjs_1.default.hash(user.password, salt);
        const users = yield User.create(Object.assign(Object.assign({}, user), { password: hashedPassword }));
        const token = jsonwebtoken_1.default.sign({
            id: users.id,
            email: users.email,
            username: users.username,
            image_url: users.image_url,
        }, process.env.SECRET_KEY);
        return { status: "success", data: users, token };
    }
    catch (error) {
        console.error(error);
        return { status: "error", error };
    }
});
exports.getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.findAll({
            include: [Post],
        });
        return { status: "success", data: users };
    }
    catch (error) {
        return { status: "error", error };
    }
});
exports.getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({
            where: { id },
            include: [Post, Comment, Like],
        });
        return { status: "success", data: user };
    }
    catch (error) {
        return { status: "error", error };
    }
});
exports.loginUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user.email)
        return { status: "error", error: "Email is empty!!!" };
    if (!user.password)
        return { status: "error", error: "Password is empty!!!" };
    const findUser = yield User.findOne({
        where: {
            email: user.email,
        },
    });
    if (!findUser)
        return { status: "error", error: "Invalid email or your yet to register" };
    try {
        const isMatchPassword = yield bcryptjs_1.default.compare(user.password, findUser.dataValues.password);
        if (isMatchPassword) {
            const token = jsonwebtoken_1.default.sign({
                id: findUser.dataValues.id,
                email: findUser.dataValues.email,
                username: findUser.dataValues.username,
                image_url: findUser.dataValues.image_url,
            }, process.env.SECRET_KEY);
            return { status: "success", data: findUser.dataValues, token };
        }
        else {
            return { status: "error", error: "password is invalid" };
        }
    }
    catch (error) { }
});
exports.updateUser = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(body);
    try {
        let user = yield User.findOne({ where: { id } });
        if (!user)
            return { status: "error", error: "User not found" };
        yield User.update(body, { where: { id } });
        return { status: "success", data: "User updated successfully!!!" };
    }
    catch (error) {
        return { status: "error", error };
    }
});
exports.deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User.destroy({ where: { id } });
        return { status: "success", data: "User deactivated!!!" };
    }
    catch (error) {
        return { status: "error", error };
    }
});
exports.resetPassword = (email, req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ where: { email } });
    try {
        if (!user) {
            return { status: "error", error: "User with this email not found" };
        }
        let resetToken = crypto_1.default.randomBytes(20).toString("hex");
        const resetPasswordToken = crypto_1.default
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        let resetPasswordExpired = Date.now() + 10 * 60 * 1000;
        const createLink = `${req.protocol}://${req.get("host")}/auth/v1/resetpassword/${resetToken}`;
        console.log({ createLink });
        let message = `You requested to reset your password click this link to create new password`;
        const options = {
            email,
            subject: "Change your password",
            message,
            resetUrl: createLink,
        };
        sendEmail_1.sendEmail(options);
        yield User.update(Object.assign(Object.assign({}, user), { resetPasswordToken, resetPasswordExpired }), { where: { id: user.id } });
        return { status: "success", data: user };
    }
    catch (error) {
        return { status: "error", error: error };
    }
});
exports.getToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resetPasswordToken = crypto_1.default
            .createHash("sha256")
            .update(token)
            .digest("hex");
        const user = yield User.findOne({
            where: {
                [sequelize_1.Op.and]: [
                    { resetPasswordToken, resetPasswordExpired: { [sequelize_1.Op.gt]: Date.now() } },
                ],
            },
        });
        if (!user) {
            return { status: "error", error: "User not found" };
        }
        return { status: "success", id: user.id };
    }
    catch (error) {
        return { status: "error", error };
    }
});
exports.changePassword = (password, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let resetPasswordTk = crypto_1.default
            .createHash("sha256")
            .update(token)
            .digest("hex");
        const user = yield User.findOne({
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
        const salt = yield bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password.password, salt);
        let obj = {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpired: null,
        };
        yield User.update(obj, {
            where: {
                id: Number(user.id),
            },
        });
        return { status: "success", data: "Password changed" };
    }
    catch (error) {
        return { status: "error", error };
    }
});
//# sourceMappingURL=user_controller.js.map