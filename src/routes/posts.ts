import { Router } from "express";
import { getLinks, createLinks } from "../controllers/post_controller";
import authenticate from "./auth";

const router = Router();

router.post("/", authenticate, async (req: any, res) => {
  const body = req.body;
  const { id } = req.user;
  const post = await createLinks(body, id);
  res.json({ data: post });
});

router.get("/", async (req, res) => {
  const posts = await getLinks();
  res.json({ data: posts });
});

export default router;
