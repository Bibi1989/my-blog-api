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
const express_1 = require("express");
const post_controller_1 = require("../controllers/post_controller");
const auth_1 = __importDefault(require("./auth"));
const cloudinary_1 = require("cloudinary");
const router = express_1.Router();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    const posts = yield post_controller_1.getPosts(page, limit);
    res.json({ data: posts });
}));
router.get("/:postId", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const posts = yield post_controller_1.getAPost(Number(postId));
    res.json({ data: posts });
}));
router.get("/post/users", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const posts = yield post_controller_1.getUsersPost(Number(id));
    res.json({ data: posts });
}));
router.post("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id, username } = req.user;
    const post = yield post_controller_1.createPost(body, id, username);
    if (post.status === "error") {
        return res.status(post.statusCode).json({ error: post.error });
    }
    res.json(post);
}));
router.post("/photo", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id, username } = req.user;
    const post = yield post_controller_1.postImage(body, id, username, req);
    if (post.status === "error") {
        return res.status(post.statusCode).json({ error: post.error });
    }
    res.json(post);
}));
router.patch("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const update = req.body;
    const { title, message } = req.body;
    const { id, username } = req.user;
    const new_update = Object.assign(Object.assign({}, update), { userId: id, username });
    const post = yield post_controller_1.updatePost(new_update, title, message);
    res.json({ data: post });
}));
router.delete("/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield post_controller_1.deletePost(Number(id));
    res.json({ data: post });
}));
exports.default = router;
//# sourceMappingURL=posts.js.map