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
const fullname_1 = require("../utils/fullname");
const cloudinary_1 = require("cloudinary");
const models = require("../../database/models/");
const { User, Post, Comment, Like } = models;
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.createUsers = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let errors = {
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
    };
    if (!user.firstname)
        errors.firstname = "First Name is empty!!!";
    if (!user.lastname)
        errors.lastname = "Last Name is empty!!!";
    if (!user.username)
        errors.username = "Username is empty!!!";
    if (!user.email)
        errors.email = "Email is empty!!!";
    if (!user.password)
        errors.password = "Password is empty!!!";
    if (errors.username || errors.email || errors.password)
        return { status: "error", statusCode: 404, error: errors };
    const userFullname = fullname_1.fullname(user.firstname, user.lastname);
    const findUser = yield User.findOne({
        where: {
            email: user.email,
        },
    });
    try {
        if (findUser) {
            return {
                status: "error",
                statusCode: 404,
                error: "User with this email exist",
            };
        }
        const salt = yield bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = yield bcryptjs_1.default.hash(user.password, salt);
        const users = yield User.create(Object.assign(Object.assign({}, user), { fullname: userFullname, password: hashedPassword }));
        const token = jsonwebtoken_1.default.sign({
            id: users.id,
            email: users.email,
            username: users.username,
            image_url: users.image_url,
        }, process.env.SECRET_KEY);
        // const data = await User.findOne({
        //   where: { id: users.id },
        //   attributes: [
        //     "id",
        //     "fullname",
        //     "firstname",
        //     "lastname",
        //     "email",
        //     "image_url",
        //     "createdAt",
        //   ],
        // });
        return { status: "success", data: users, token };
    }
    catch (error) {
        return { status: "error", statusCode: 400, error };
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
        return { status: "error", statusCode: 400, error };
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
        return { status: "error", statusCode: 400, error };
    }
});
exports.loginUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let errors = {
        email: "",
        password: "",
    };
    if (!user.email)
        errors.email = "Email is empty!!!";
    if (!user.password)
        errors.password = "Password is empty!!!";
    if (errors.email || errors.password)
        return { status: "error", statusCode: 404, error: errors };
    const findUser = yield User.findOne({
        where: {
            email: user.email,
        },
    });
    if (!findUser)
        return {
            status: "error",
            statusCode: 404,
            error: "Invalid email or your yet to register",
        };
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
            return { status: "error", statusCode: 404, error: "password is invalid" };
        }
    }
    catch (error) {
        return { status: "error", statusCode: 400, error };
    }
});
exports.updateUser = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield User.findOne({ where: { id } });
        if (!user)
            return {
                status: "error",
                statusCode: 404,
                error: `User with this ID: ${id} not found`,
            };
        yield User.update(body, { where: { id } });
        return { status: "success", data: "User updated successfully!!!" };
    }
    catch (error) {
        return { status: "error", statusCode: 400, error };
    }
});
exports.addUserPhoto = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({ where: { id } });
        if (!user)
            return {
                status: "error",
                statusCode: 404,
                error: `User with this ID: ${id} not found`,
            };
        let file = req.files.file;
        let fileImage = yield cloudinary_1.v2.uploader.upload(file.tempFilePath, {
            folder: "blog",
            transformation: [{ width: 500, height: 350, crop: "fill" }],
        }, (err, result) => {
            if (err) {
                console.log(err);
            }
            return result;
        });
        yield User.update({ image_url: fileImage.secure_url }, { where: { id } });
        return { status: "success", data: "User Photo updated successfully!!!" };
    }
    catch (error) {
        return { status: "success", statusCode: 400, error };
    }
});
exports.deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({ where: { id } });
        if (!user) {
            return {
                status: "error",
                statusCode: 404,
                error: `User with this ID: ${id} not found`,
            };
        }
        yield User.destroy({ where: { id } });
        return { status: "success", data: "User deactivated!!!" };
    }
    catch (error) {
        return { status: "error", statusCode: 400, error };
    }
});
exports.resetPassword = (email, req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ where: { email } });
    try {
        if (!user) {
            return {
                status: "error",
                statusCode: 404,
                error: "User with this email not found",
            };
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
        return { status: "error", statusCode: 400, error: error };
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
            return { status: "error", statusCode: 404, error: "User not found" };
        }
        return { status: "success", id: user.id };
    }
    catch (error) {
        return { status: "error", statusCode: 400, error };
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
            return { status: "error", statusCode: 404, error: "User not found" };
        }
        if (!password) {
            return {
                status: "error",
                statusCode: 404,
                error: "No password provided",
            };
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
        return { status: "error", statusCode: 400, error };
    }
});
//# sourceMappingURL=user_controller.js.map