import express, { Request, Response, NextFunction } from "express";
import createError, { HttpError } from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// imports
import postRoute from "./routes/posts";
import commentsRoute from "./routes/comment";
import likeRoute from "./routes/likes";
import noticeRoute from "./routes/notification";
import userRoute from "./routes/users";

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/comments", commentsRoute);
app.use("/api/v1/likes", likeRoute);
app.use("/api/v1/notices", noticeRoute);
app.use("/auth/v1", userRoute);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.log(err);

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
