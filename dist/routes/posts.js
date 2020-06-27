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
const router = express_1.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_controller_1.getPosts();
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
    const { id, username, image_url } = req.user;
    console.log(image_url);
    if (!body.title)
        return res.json({ status: "error", error: "Title field is empty!!!" });
    if (!body.message)
        return res.json({ status: "error", error: "Message field is empty!!!" });
    const post = yield post_controller_1.createPost(body, id, username, image_url);
    res.json({ data: post });
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