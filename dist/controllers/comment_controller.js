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
const { User, Post, Comment } = models;
exports.createComment = (message, id, postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield Comment.create(Object.assign(Object.assign({}, message), { userId: id, postId }));
        return { status: "success", comments };
    }
    catch (error) {
        console.error(error);
        return { status: "error", error };
    }
});
exports.getComments = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield Comment.findAll({
            where: {
                postId: id,
            },
            include: [User, Post],
        });
        return { status: "success", comments };
    }
    catch (error) {
        return { status: "error", error };
    }
});
//# sourceMappingURL=comment_controller.js.map