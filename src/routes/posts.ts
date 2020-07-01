import { Router, Request } from "express";
import {
  getPosts,
  getAPost,
  createPost,
  updatePost,
  getUsersPost,
  deletePost,
  postImage,
} from "../controllers/post_controller";
import authenticate from "./auth";
import { v2 } from "cloudinary";

const router = Router();

interface AuthInterface {
  username: string;
  email: string;
  id: number;
  image_url?: string;
}

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get("/", async (req, res) => {
  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 10;
  const posts = await getPosts(page, limit);
  res.json({ data: posts });
});
router.get("/:postId", authenticate, async (req, res) => {
  const { postId } = req.params;
  console.log(postId);
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
  const { id, username } = req.user;

  const post = await createPost(body, id, username);

  if (post.status === "error") {
    return res.status(post.statusCode).json({ error: post.error });
  }
  res.json(post);
});

router.post("/photo", authenticate, async (req: any, res) => {
  const body = req.body;
  const { id, username } = req.user;

  const post = await postImage(body, id, username, req);

  if (post.status === "error") {
    return res.status(post.statusCode).json({ error: post.error });
  }
  res.json(post);
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
