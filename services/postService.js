import postRepository from "../repositories/postRepository.js";

const postService = {
  createPost: async (postData) => {
    await postRepository.createPost(postData);
  },

  getPosts: async ({ page, limit, category, keyword }) => {
    const offset = (page - 1) * limit;

    const { posts, totalPosts } =
      await postRepository.getPosts({
        limit,
        offset,
        category,
        keyword,
      });

    const totalPages = Math.ceil(totalPosts / limit);

    return {
      totalPosts,
      totalPages,
      currentPage: page,
      limit,
      posts,
    };
  },

  getPostById: async (postId) => {
    // เผื่ออนาคตจะเช็ค status = publish
    return await postRepository.findPostById(postId);
  },

  deletePost: async (postId) => {
    return await postRepository.deleteById(postId);
  },

  updatePost: async (postId, payload) => {
    const {
      title,
      image,
      category_id,
      description,
      content,
      status_id,
    } = payload;

    // จุดนี้เพิ่ม rule ได้ เช่น validate ownership / status
    return await postRepository.updateById(postId, {
      title,
      image,
      category_id,
      description,
      content,
      status_id,
    });
  },

};

export default postService;
