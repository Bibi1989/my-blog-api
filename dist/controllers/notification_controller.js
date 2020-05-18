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
const { User, Notification } = models;
exports.createNotification = (notices) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notice = yield Notification.create(Object.assign({}, notices));
        return { status: "success", notice };
    }
    catch (error) {
        console.error(error);
        return { status: "error", error };
    }
});
exports.getNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notices = yield Notification.findAll({
            where: {
                userId,
            },
            include: [User],
        });
        return { status: "success", notices };
    }
    catch (error) {
        return { status: "error", error };
    }
});
//# sourceMappingURL=notification_controller.js.map