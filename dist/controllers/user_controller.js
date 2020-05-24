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
        console.log(hashedPassword);
        const users = yield User.create(Object.assign(Object.assign({}, user), { image_url: user.image_url == "[]" ? null : user.image_url, password: hashedPassword }));
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
exports.deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User.destroy({ where: { id } });
        return { status: "success", data: "User deactivated!!!" };
    }
    catch (error) {
        return { status: "error", error };
    }
});
//# sourceMappingURL=user_controller.js.map