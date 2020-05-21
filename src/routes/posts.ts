import { Router, Request } from "express";
import {
  getPosts,
  getAPost,
  createPost,
  updatePost,
  getUsersPost,
  deletePost,
} from "../controllers/post_controller";
import authenticate from "./auth";

const router = Router();

interface AuthInterface {
  username: string;
  email: string;
  id: number;
  image_url?: string;
}

router.get("/", async (req, res) => {
  const posts = await getPosts();
  res.json({ data: posts });
});
router.get("/:postId", authenticate, async (req, res) => {
  const { postId } = req.params;
  const posts = await getAPost(Number(postId));
  res.json({ data: posts });
});
router.get("/post/users", authenticate, async (req: any, res) => {
  const { id } = req.user;
  const posts = await getUsersPost(Number(id));
  res.json({ data: posts });
});

router.post("/", authenticate, async (req: any, res) => {
  const body = req.body;
  const { id, username, image_url } = req.user;

  console.log(body);

  if (!body.title)
    return res.json({ status: "error", error: "Title field is empty!!!" });
  if (!body.message)
    return res.json({ status: "error", error: "Message field is empty!!!" });
  const post = await createPost(body, id, username, image_url);
  res.json({ data: post });
});

router.patch("/", authenticate, async (req: any, res) => {
  const update = req.body;
  const { title, message } = req.body;
  const { id, username } = req.user;
  const new_update = {
    ...update,
    userId: id,
    username,
  };
  const post = await updatePost(new_update, title, message);
  res.json({ data: post });
});
router.delete("/:id", authenticate, async (req: any, res) => {
  const { id } = req.params;
  const post = await deletePost(Number(id));
  res.json({ data: post });
});

export default router;
