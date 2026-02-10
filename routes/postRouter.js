import express from "express";
import postController from "../controllers/postController.js";
import { validateCreatePost } from "../middlewares/postValidation.js";

const postRouter = express.Router();

postRouter.post(
  "/",
  validateCreatePost,
  postController.createPost
);

postRouter.get(
  "/",
  postController.getPosts
);

postRouter.get(
  "/:postId",
  postController.getPostById
);

postRouter.delete(
  "/:postId",
  postController.deletePost
);

postRouter.put(
  "/:postId",
  validateCreatePost,
  postController.updatePost
);

export default postRouter;
