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
const bcrypt_1 = require("bcrypt");
const models = require("../../database/models/");
const { User, Url } = models;
exports.createUsers = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield User.findOne({
        where: {
            email: user.email,
        },
    });
    //   console.log();
    try {
        if (findUser) {
            return { status: "error", error: "User with this email exist" };
        }
        const salt = yield bcrypt_1.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(user.password, salt);
        const users = yield User.create(Object.assign(Object.assign({}, user), { hashedPassword }));
        const token = jsonwebtoken_1.default.sign({
            id: users.id,
            email: users.email,
            username: users.username,
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
            include: [Url],
        });
        return { status: "success", data: users };
    }
    catch (error) {
        return { status: "error", error };
    }
});
//# sourceMappingURL=user_controller.js.map