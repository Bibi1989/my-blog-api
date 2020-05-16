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
const { User, Post, Comment, Notification } = models;
exports.createLinks = (post, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post.create(Object.assign(Object.assign({}, post), { userId: Number(id) }));
        return { status: "success", data: posts };
    }
    catch (error) {
        console.error(error);
        return { status: "error", error };
    }
});
exports.getLinks = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post.findAll({
            include: [User, Comment],
        });
        return { status: "success", data: posts };
    }
    catch (error) {
        return { status: "error", error };
    }
});
//# sourceMappingURL=post_controller.js.map