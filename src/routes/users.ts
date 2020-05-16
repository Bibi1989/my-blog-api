import { Router } from "express";
import { createUsers, getUsers } from "../controllers/user_controller";

const router = Router();

router.post("/register", async (req, res) => {
  const body = req.body;
  const user = await createUsers(body);
  res.header("auth", user.token);
  res.json({ data: user });
});
router.get("/users", async (_req, res) => {
  const users = await getUsers();
  res.json({ data: users });
});

export default router;
