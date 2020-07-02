import { Router } from "express";
import { getLikes, createLike } from "../controllers/like_controller";
import authenticate from "./auth";

const router = Router();

router.post("/", authenticate, async (req: any, res) => {
  const { id, username } = req.user;
  const { postId } = req.body;
  console.log(postId);
  const link = await createLike(Number(id), Number(postId), username);
  if (link.status === "error") {
    res.status(404).json(link);
  }
  res.json({ data: link });
});

router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const likes = await getLikes(Number(id));
  res.json({ data: likes });
});

export default router;
