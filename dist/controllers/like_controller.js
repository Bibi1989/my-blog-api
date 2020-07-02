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
exports.createLike = (userId, postId, username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findPost = yield Like.findOne({ where: { postId, userId } });
        if (!findPost) {
            const like = yield Like.create({
                message: `${username} liked your post`,
                userId,
                postId,
                username,
            });
            return { status: "success", like };
        }
        else {
            yield Like.destroy({ where: { postId, userId } });
            return { status: "error", message: "Post not found" };
        }
    }
    catch (error) {
        console.error(error);
        return { status: "error", error };
    }
});
// export const destroyLike = async (
//   userId: number,
//   postId: number,
//   username: string
// ) => {
//   try {
//     const findPost = await Like.findOne({ where: { postId, userId } });
//     if (findPost) {
//       await Like.destroy({ where: { postId, userId } });
//       return { status: "error", message: "Post not found" };
//     }
//   } catch (error) {
//     console.error(error);
//     return { status: "error", error };
//   }
// };
exports.getLikes = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const likes = yield Like.findAll({
            where: {
                id,
            },
            include: [User, Post],
        });
        return { status: "success", likes, likeCount: likes.length };
    }
    catch (error) {
        return { status: "error", error };
    }
});
//# sourceMappingURL=like_controller.js.map