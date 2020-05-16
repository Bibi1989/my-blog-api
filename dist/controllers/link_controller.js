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
const { User, Url } = models;
exports.createLinks = (link, id) => __awaiter(void 0, void 0, void 0, function* () {
    const findLink = yield Url.findOne({
        where: {
            title: link.title,
        },
    });
    if (findLink) {
        return {
            status: "error",
            error: "You have add this link already, you can update it",
        };
    }
    try {
        const links = yield Url.create(Object.assign(Object.assign({}, link), { userId: Number(id) }));
        return { status: "success", data: links };
    }
    catch (error) {
        console.error(error);
        return { status: "error", error };
    }
});
exports.getLinks = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const links = yield Url.findAll({
            include: [User],
        });
        return { status: "success", data: links };
    }
    catch (error) {
        return { status: "error", error };
    }
});
//# sourceMappingURL=link_controller.js.map