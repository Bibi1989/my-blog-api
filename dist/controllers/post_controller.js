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
const cloudinary_1 = require("cloudinary");
const models = require("../../database/models/");
const { User, Post, Comment, Like } = models;
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.createPost = (post, id, username) => __awaiter(void 0, void 0, void 0, function* () {
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
        const check = yield Post.findOne({
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
        const posts = yield Post.create(Object.assign(Object.assign({}, post), { username, userId: Number(id) }));
        const findPost = yield Post.findOne({
            where: { id: posts.id },
            include: [User, Comment, Like],
        });
        return { status: "success", data: findPost };
    }
    catch (error) {
        console.error(error);
        return { status: "error", statusCode: 400, error };
    }
});
exports.postImage = (form, id, username, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(form);
        const img = yield cloudinary_1.v2.uploader.upload(req.files.image.tempFilePath, { folder: "blog" }, (err, result) => {
            if (err) {
                console.log(err);
            }
            return result;
        });
        const posts = yield Post.create(Object.assign(Object.assign({}, form), { image_url: img.secure_url, username, userId: Number(id) }));
        return { status: "success", data: posts };
    }
    catch (error) {
        return { status: "error", statusCode: 400, error };
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