import { Router } from "express";
import {
  createUsers,
  getUsers,
  loginUser,
  getUser,
} from "../controllers/user_controller";
import authenticate from "./auth";

const router = Router();

router.post("/register", async (req, res) => {
  const body = req.body;
  const user = await createUsers(body);
  res.header("auth", user.token);
  res.json({ data: user });
});
router.post("/login", async (req, res) => {
  const body = req.body;
  const user = await loginUser(body);
  res.header("auth", user.token);
  res.json({ data: user });
});
router.get("/", async (_req, res) => {
  const users = await getUsers();
  res.json({ data: users });
});
router.get("/users", authenticate, async (req: any, res) => {
  const { id } = req.user;
  const user = await getUser(Number(id));
  res.json({ data: user });
});

export default router;
