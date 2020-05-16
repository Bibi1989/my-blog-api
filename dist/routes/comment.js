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
const comment_controller_1 = require("../controllers/comment_controller");
const auth_1 = __importDefault(require("./auth"));
const router = express_1.Router();
router.post("/:postId", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.user;
    const { postId } = req.params;
    const link = yield comment_controller_1.createComment(body, Number(id), Number(postId));
    res.json({ data: link });
}));
router.get("/:postId", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    console.log(postId);
    const links = yield comment_controller_1.getComments(Number(postId));
    console.log(links);
    res.json({ data: links });
}));
exports.default = router;
//# sourceMappingURL=comment.js.map