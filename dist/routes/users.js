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
const user_controller_1 = require("../controllers/user_controller");
const auth_1 = __importDefault(require("./auth"));
const router = express_1.Router();
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const user = yield user_controller_1.createUsers(body);
    res.header("auth", user.token);
    res.json({ data: user });
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const user = yield user_controller_1.loginUser(body);
    res.header("auth", user.token);
    res.json({ data: user });
}));
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_controller_1.getUsers();
    res.json({ data: users });
}));
router.get("/users", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const user = yield user_controller_1.getUser(Number(id));
    res.json({ data: user });
}));
exports.default = router;
//# sourceMappingURL=users.js.map