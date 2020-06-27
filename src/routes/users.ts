import { Router } from "express";
import {
  createUsers,
  getUsers,
  loginUser,
  getUser,
  deleteUser,
  resetPassword,
  updateUser,
  getToken,
  changePassword,
  addUserPhoto,
} from "../controllers/user_controller";
import authenticate from "./auth";
import { v2 } from "cloudinary";

const router = Router();

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/register", async (req, res) => {
  const body = req.body;
  const user = await createUsers(body);
  if (user.status === "error") {
    return res.status(user.statusCode).json({ error: user.error });
  }
  res.header("auth", user.token);
  res.json(user);
});
router.post("/login", async (req, res) => {
  const body = req.body;
  const user = await loginUser(body);
  if (user.status === "error") {
    return res.status(user.statusCode).json({ error: user.error });
  }
  res.header("auth", user.token);
  res.json(user);
});
router.post("/forgot", async (req, res) => {
  const email = req.body.email;
  const user = await resetPassword(email, req);
  res.json(user);
});
router.get("/users", async (_req, res) => {
  const users = await getUsers();
  if (users.status === "error") {
    return res.status(users.statusCode).json({ error: users.error });
  }
  res.json(users);
});
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await getUser(Number(id));
  if (user.status === "error") {
    return res.status(user.statusCode).json({ error: user.error });
  }
  res.json(user);
});
router.get("/resetpassword/:token", async (req, res) => {
  const { token } = req.params;
  const user = await getToken(token);

  if (user.status === "error") {
    return res.redirect(`https://bibiblog.netlify.app/error`);
  }
  // res.redirect(`http://localhost:3000/forgotpassword/${token}`);
  res.redirect(`https://bibiblog.netlify.app/forgotpassword/${token}`);
});

router.patch("/", authenticate, async (req: any, res) => {
  const { id } = req.user;
  const user = await updateUser(Number(id), req.body);
  if (user.status === "error") {
    return res.status(user.statusCode).json({ error: user.error });
  }
  res.json(user);
});

router.patch("/photo", authenticate, async (req: any, res) => {
  const { id } = req.user;
  const user = await addUserPhoto(Number(id), req);
  if (user.status === "error") {
    return res.status(user.statusCode).json({ error: user.error });
  }
  res.json(user);
});

router.patch("/resetpassword/:token", async (req, res) => {
  const { token } = req.params;
  const user = await changePassword(req.body, token);
  if (user.status === "error") {
    return res.status(user.statusCode).json({ error: user.error });
  }
  res.json(user);
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await deleteUser(Number(id));
  if (user.status === "error") {
    return res.status(user.statusCode).json({ error: user.error });
  }
  res.json(user);
});

export default router;
