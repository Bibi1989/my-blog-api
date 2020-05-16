import { Router } from "express";
import { getComments, createLike } from "../controllers/like_controller";
import authenticate from "./auth";

const router = Router();

router.post("/", authenticate, async (req: any, res) => {
  const body = req.body;
  const { id, username } = req.user;
  console.log(req.user);
  const { postId } = req.body;
  const link = await createLike(Number(id), Number(postId), username);
  res.json({ data: link });
});

router.get("/:postId", authenticate, async (req, res) => {
  const { postId } = req.params;
  const links = await getComments(Number(postId));
  console.log(links);
  res.json({ data: links });
});

export default router;
