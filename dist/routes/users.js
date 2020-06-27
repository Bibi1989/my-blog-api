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
    if (user.status === "error") {
        return res.status(user.statusCode).json({ error: user.error });
    }
    res.header("auth", user.token);
    res.json(user);
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const user = yield user_controller_1.loginUser(body);
    if (user.status === "error") {
        return res.status(user.statusCode).json({ error: user.error });
    }
    res.header("auth", user.token);
    res.json(user);
}));
router.post("/forgot", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield user_controller_1.resetPassword(email, req);
    res.json(user);
}));
router.get("/users", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_controller_1.getUsers();
    if (users.status === "error") {
        return res.status(users.statusCode).json({ error: users.error });
    }
    res.json(users);
}));
router.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_controller_1.getUser(Number(id));
    if (user.status === "error") {
        return res.status(user.statusCode).json({ error: user.error });
    }
    res.json(user);
}));
router.get("/resetpassword/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const user = yield user_controller_1.getToken(token);
    if (user.status === "error") {
        return res.redirect(`https://bibiblog.netlify.app/error`);
    }
    // res.redirect(`http://localhost:3000/forgotpassword/${token}`);
    res.redirect(`https://bibiblog.netlify.app/forgotpassword/${token}`);
}));
router.patch("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const user = yield user_controller_1.updateUser(Number(id), req.body, req);
    if (user.status === "error") {
        return res.status(user.statusCode).json({ error: user.error });
    }
    res.json(user);
}));
router.patch("/resetpassword/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const user = yield user_controller_1.changePassword(req.body, token);
    if (user.status === "error") {
        return res.status(user.statusCode).json({ error: user.error });
    }
    res.json(user);
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_controller_1.deleteUser(Number(id));
    if (user.status === "error") {
        return res.status(user.statusCode).json({ error: user.error });
    }
    res.json(user);
}));
exports.default = router;
//# sourceMappingURL=users.js.map