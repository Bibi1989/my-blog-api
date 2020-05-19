import { Router } from "express";
import {
  getNotifications,
  createNotification,
  deleteNotification,
} from "../controllers/notification_controller";
import authenticate from "./auth";

const router = Router();

router.post("/", authenticate, async (req: any, res) => {
  const notices = req.body;
  console.log({ notices });
  const link = await createNotification(notices);
  res.json({ data: link });
});

router.get("/", authenticate, async (req: any, res) => {
  const { id } = req.user;
  const notices = await getNotifications(Number(id));
  res.json({ data: notices });
});
router.delete("/:id", authenticate, async (req: any, res) => {
  const { id } = req.params;
  const deleted = await deleteNotification(Number(id));
  res.json({ data: deleted });
});

export default router;
