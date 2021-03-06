import { Router } from "express";
import { getComments, createComment } from "../controllers/comment_controller";
import authenticate from "./auth";

const router = Router();

router.post("/:postId", authenticate, async (req: any, res) => {
  const { message } = req.body;
  const { id } = req.user;
  const { postId } = req.params;

  if (!message)
    return res.json({ status: "error", error: "Message field is empty!!!" });

  const link = await createComment(message, Number(id), Number(postId));

  res.json(link);
});

router.get("/:postId", authenticate, async (req, res) => {
  const { postId } = req.params;
  const comments = await getComments(Number(postId));
  res.json(comments);
});

export default router;
