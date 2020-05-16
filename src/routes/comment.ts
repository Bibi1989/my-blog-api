import { Router } from "express";
import { getComments, createComment } from "../controllers/comment_controller";
import authenticate from "./auth";

const router = Router();

router.post("/:postId", authenticate, async (req: any, res) => {
  const body = req.body;
  const { id } = req.user;
  const { postId } = req.params;
  const link = await createComment(body, Number(id), Number(postId));
  res.json({ data: link });
});

router.get("/:postId", authenticate, async (req, res) => {
  const { postId } = req.params;
  console.log(postId);
  const links = await getComments(Number(postId));
  console.log(links);
  res.json({ data: links });
});

export default router;
