import { Router } from "express";
import { getLinks, createLinks } from "../controllers/link_controller";
import authenticate from "./auth";

const router = Router();

router.post("/", authenticate, async (req: any, res) => {
  const body = req.body;
  const { id } = req.user;
  const link = await createLinks(body, id);
  res.json({ data: link });
});

router.get("/", authenticate, async (req, res) => {
  const links = await getLinks();
  res.json({ data: links });
});

export default router;
