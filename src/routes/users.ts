import { Router } from "express";
import {
  createUsers,
  getUsers,
  loginUser,
  getUser,
  deleteUser,
} from "../controllers/user_controller";

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
router.get("/users", async (_req, res) => {
  const users = await getUsers();
  res.json({ data: users });
});
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await getUser(Number(id));
  res.json({ data: user });
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await deleteUser(Number(id));
  res.json({ data: user });
});

export default router;
