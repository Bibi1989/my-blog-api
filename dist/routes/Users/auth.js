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
const router = express_1.Router();
const validation_1 = require("../../middlewares/validation");
const pg_connect_1 = require("../../models/pg-connect");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = validation_1.validateAuth(req.body);
    if (error) {
        return res.status(404).json({ error: error.details[0].message });
    }
    const { email, password } = value;
    let [user] = yield pg_connect_1.db.query(pg_connect_1.sql `SELECT * FROM users WHERE email=${email}`);
    if (!user) {
        return res
            .status(404)
            .json({ error: "You can't login until you register" });
    }
    const validPassword = yield bcryptjs_1.default.compare(password, user.password);
    if (!validPassword) {
        res.status(404).json({ error: "Invalid password" });
    }
    try {
        const token = yield jsonwebtoken_1.default.sign({ id: user.id }, process.env.SECRET_KEY);
        res.header("auth", token);
        res.status(200).json({ data: { email: user.email }, token });
    }
    catch (error) {
        console.log(error.message);
        res.status(404).json({ error: error.message });
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map