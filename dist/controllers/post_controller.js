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
Object.defineProperty(exports, "__esModule", { value: true });
const models = require("../../database/models/");
const { User, Post, Comment, Like } = models;
exports.createPost = (post, id, username, image_url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post.create(Object.assign(Object.assign({}, post), { username,
            image_url, userId: Number(id) }));
        return { status: "success", data: posts };
    }
    catch (error) {
        console.error(error);
        return { status: "error", error };
    }
});
exports.getPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post.findAll({
            include: [User, Comment, Like],
        });
        return { status: "success", data: posts };
    }
    catch (error) {
        return { status: "error", error };
    }
});
exports.getAPost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post.findOne({
            where: { id },
            include: [User, Comment, Like],
        });
        return { status: "success", data: post };
    }
    catch (error) {
        return { status: "error", error };
    }
});
exports.getUsersPost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post.findAll({
            where: { userId: id },
            include: [User, Comment, Like],
        });
        return { status: "success", data: post };
    }
    catch (error) {
        return { status: "error", error };
    }
});
exports.updatePost = (post, title, message) => __awaiter(void 0, void 0, void 0, function* () {
    const findPost = yield Post.findOne({
        where: { id: post.id },
    });
    try {
        if (findPost) {
            yield Post.update(Object.assign(Object.assign({}, post), { title, message }), { where: { id: post.id } }, {
                include: [User, Comment, Like],
            });
        }
        return { status: "success", data: post };
    }
    catch (error) {
        return { status: "error", error };
    }
});
exports.deletePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const findPost = yield Post.findOne({
        where: { id },
    });
    try {
        if (findPost) {
            yield Post.destroy({ where: { id } });
        }
        return { status: "success", data: "Post deleted!!!" };
    }
    catch (error) {
        return { status: "error", error };
    }
});
//# sourceMappingURL=post_controller.js.map