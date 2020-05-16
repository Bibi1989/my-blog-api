import { Router } from "express";
import { getHistories, createHistory } from "../controllers/history_controller";
import authenticate from "./auth";

const router = Router();

router.post("/", authenticate, async (req: any, res) => {
  const body = req.body;
  const { id } = req.user;
  const link = await createHistory(body, id);
  res.json({ data: link });
});

router.get("/", authenticate, async (req, res) => {
  const links = await getHistories();
  res.json({ data: links });
});

export default router;
