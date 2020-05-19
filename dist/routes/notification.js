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
const notification_controller_1 = require("../controllers/notification_controller");
const auth_1 = __importDefault(require("./auth"));
const router = express_1.Router();
router.post("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notices = req.body;
    console.log({ notices });
    const link = yield notification_controller_1.createNotification(notices);
    res.json({ data: link });
}));
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const notices = yield notification_controller_1.getNotifications(Number(id));
    res.json({ data: notices });
}));
router.delete("/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deleted = yield notification_controller_1.deleteNotification(Number(id));
    res.json({ data: deleted });
}));
exports.default = router;
//# sourceMappingURL=notification.js.map