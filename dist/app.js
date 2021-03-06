"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = express_1.default();
// imports
const posts_1 = __importDefault(require("./routes/posts"));
const comment_1 = __importDefault(require("./routes/comment"));
const likes_1 = __importDefault(require("./routes/likes"));
const notification_1 = __importDefault(require("./routes/notification"));
const users_1 = __importDefault(require("./routes/users"));
app.use(cors_1.default());
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(express_fileupload_1.default({ useTempFiles: true }));
// routes
app.use("/api/v1/posts", posts_1.default);
app.use("/api/v1/comments", comment_1.default);
app.use("/api/v1/likes", likes_1.default);
app.use("/api/v1/notices", notification_1.default);
app.use("/auth/v1", users_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(http_errors_1.default(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
exports.default = app;
//# sourceMappingURL=app.js.map