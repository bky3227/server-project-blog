import pool from "../utils/db.mjs";

const postRepository = {
  createPost: async ({
    title,
    image,
    category_id,
    description,
    content,
    status_id,
  }) => {
    const query = `
      INSERT INTO posts
      (title, image, category_id, description, content, status_id)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const values = [
      title,
      image,
      category_id,
      description,
      content,
      status_id,
    ];

    await pool.query(query, values);
  },

  getPosts: async ({ limit, offset, category, keyword }) => {
    const conditions = [];
    const values = [];

    // filter by category
    if (category) {
      values.push(category);
      conditions.push(`c.name = $${values.length}`);
    }

    // filter by keyword
    if (keyword) {
      values.push(`%${keyword}%`);
      conditions.push(
        `(p.title ILIKE $${values.length}
        OR p.description ILIKE $${values.length})`
      );
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    // 👉 query posts
    const postsQuery = `
      SELECT
        p.id,
        p.image,
        c.name AS category,
        p.title,
        p.description,
        p.date AS date,
        p.content,
        s.status AS status,
        p.likes_count
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      JOIN statuses s ON p.status_id = s.id
      ${whereClause}
      ORDER BY p.date DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}`
    ;

    const postsResult = await pool.query(postsQuery, [
      ...values,
      limit,
      offset,
    ]);

    // 👉 query total count
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      ${whereClause}`
    ;

    const countResult = await pool.query(countQuery, values);

    return {
      posts: postsResult.rows,
      totalPosts: Number(countResult.rows[0].total),
    };
  },

  findPostById: async (postId) => {
    const result = await pool.query(
      `
      SELECT
        p.id,
        p.image,
        c.name AS category,
        p.title,
        p.description,
        p.date AS date,
        p.content,
        s.status AS status,
        p.likes_count
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      JOIN statuses s ON p.status_id = s.id
      WHERE p.id = $1
      `,
      [postId]
    );

    return result.rows[0] || null;
  },

  deleteById: async (postId) => {
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1",
      [postId]
    );

    return result.rowCount > 0;
  },

   updateById: async (postId, data) => {
    const {
      title,
      image,
      category_id,
      description,
      content,
      status_id,
    } = data;

    const result = await pool.query(
      `
      UPDATE posts
      SET
        title = $1,
        image = $2,
        category_id = $3,
        description = $4,
        content = $5,
        status_id = $6
      WHERE id = $7
      `,
      [
        title,
        image,
        category_id,
        description,
        content,
        status_id,
        postId,
      ]
    );

    return result.rowCount > 0;
  },

};

export default postRepository;