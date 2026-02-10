import postService from "../services/postService.js";

const postController = {
  createPost: async (req, res) => {
    try {
      await postService.createPost(req.body);

      return res.status(201).json({
        message: "Created post sucessfully",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Server could not create post because database connection",
          error: error.message,
      });
    }
  },

  getPosts: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 6,
        category,
        keyword,
      } = req.query;

      const result = await postService.getPosts({
        page: Number(page),
        limit: Number(limit),
        category,
        keyword,
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error("DB ERROR:", error);

      return res.status(500).json({
        message: "Unable to fetch posts.",
        error: error.message,
      });
    }
  },

  getPostById: async (req, res) => {
    try {
      const { postId } = req.params;

      const post = await postService.getPostById(postId);

      if (!post) {
        return res.status(404).json({
          message: "Server could not find a requested post",
        });
      }

      return res.status(200).json(post);
    } catch (error) {
      console.error("CONTROLLER ERROR:", error);

      return res.status(500).json({
        message: "Server could not read post because database connection",
        error: error.message,
      });
    }
  },

  deletePost: async (req, res) => {
    try {
      const { postId } = req.params;

      const deleted = await postService.deletePost(postId);

      if (!deleted) {
        return res.status(404).json({
          message: "Server could not find a requested post to delete",
        });
      }

      return res.status(200).json({
        message: "Deleted post sucessfully",
      });
    } catch (error) {
      console.error("CONTROLLER ERROR:", error);

      return res.status(500).json({
        message: "Server could not delete post because database connection",
        error: error.message,
      });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { postId } = req.params;
      const payload = req.body;

      const updated = await postService.updatePost(postId, payload);

      if (!updated) {
        return res.status(404).json({
          message: "Server could not find a requested post to update",
        });
      }

      return res.status(200).json({
        message: "Updated post sucessfully",
      });
    } catch (error) {
      console.error("CONTROLLER ERROR:", error);

      return res.status(500).json({
        message: "Server could not update post because database connection",
      });
    }
  },

};

export default postController;
