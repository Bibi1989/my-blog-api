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
router.post("/forgot", async (req, res) => {
  const email = req.body.email;
  const user = await resetPassword(email, req);
  res.json(user);
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
router.get("/resetpassword/:token", async (req, res) => {
  const { token } = req.params;
  const user = await getToken(token);

  if (user.status === "error") {
    return res.status(404).json({ error: user.error });
  }
  // res.redirect(`http://localhost:3000/forgotpassword/${token}`);
  res.redirect(`https://bibiblog.netlify.app/forgotpassword/${token}`);
});
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await updateUser(Number(id), req.body);
  res.json({ data: user });
});
router.patch("/resetpassword/:token", async (req, res) => {
  const { token } = req.params;
  const user = await changePassword(req.body, token);
  res.json({ data: user });
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await deleteUser(Number(id));
  res.json({ data: user });
});

export default router;
