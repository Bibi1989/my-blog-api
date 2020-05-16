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
router.post("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.user;
    const post = yield post_controller_1.createLinks(body, id);
    res.json({ data: post });
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_controller_1.getLinks();
    res.json({ data: posts });
}));
exports.default = router;
//# sourceMappingURL=posts.js.map