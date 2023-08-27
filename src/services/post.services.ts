import { QueryResult } from "pg";
import { CreatePostPayload, IComment, IPost } from "../types";
import { pool, RedisService } from "../config";

export const savePost = async (postData: CreatePostPayload): Promise<IPost> => {
  const { user_id, title, content } = postData;
  const query = `
  INSERT INTO posts (title, content, user_id, created_at, updated_at)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`;

  const values = [title, content, user_id, new Date(), new Date()];

  try {
    const result: QueryResult<IPost> = await pool.query(query, values);

    return result.rows[0];
  } catch (error) {
    console.error("Error saving post:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

export const getPostsByUserId = async (user_id: number): Promise<IPost[]> => {
  const query = `
      SELECT * FROM posts WHERE user_id = $1;
    `;
  const values = [user_id];

  try {
    const result: QueryResult<IPost> = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

export const getPostById = async (post_id: number): Promise<IPost | null> => {
  const query = `
    SELECT * FROM posts WHERE id = $1 LIMIT 1;
  `;
  const values = [post_id];

  try {
    const result: QueryResult<IPost> = await pool.query(query, values);
    return result.rows[0] || null; // Return the first row if found, otherwise null
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

export const savePostComment = async ({
  post_id,
  user_id,
  content,
}: {
  post_id: number;
  user_id?: number;
  content: string;
}): Promise<IComment> => {
  const query = `
  INSERT INTO comments (content, post_id, user_id, created_at, updated_at)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`;

  const values = [content, post_id, user_id, new Date(), new Date()];
  const result: QueryResult<IComment> = await pool.query(query, values);
  return result.rows[0];
};

export const fetchTopUsers = async (): Promise<any> => {
  try {
    const redisKey = "topUsers";
    const ttl = 120;

    const cachedData = await RedisService.getClient().get(redisKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  
    const query = `
    WITH UserPostCounts AS (
      SELECT
          u.id AS user_id,
          u.name AS user_name,
          COUNT(p.id) AS post_count,
          ROW_NUMBER() OVER (ORDER BY COUNT(p.id) DESC) AS user_rank
      FROM
          users u
      LEFT JOIN
          posts p ON u.id = p.user_id
      GROUP BY
          u.id, u.name
  ),
  UserLatestComment AS (
      SELECT
          u.id AS user_id,
          c.content AS latest_comment,
          MAX(c.created_at) AS latest_comment_date
      FROM
          users u
      LEFT JOIN
          posts p ON u.id = p.user_id
      LEFT JOIN
          comments c ON p.id = c.post_id
      WHERE
          c.created_at = (SELECT MAX(created_at) FROM comments WHERE comments.post_id = p.id)
      GROUP BY
          u.id, c.content
  )
  SELECT
      upc.user_id,
      upc.user_name,
      upc.post_count,
      ulc.latest_comment,
      ulc.latest_comment_date
  FROM
      UserPostCounts upc
  JOIN
      UserLatestComment ulc ON upc.user_id = ulc.user_id
  WHERE
      upc.user_rank <= 3
  ORDER BY
      upc.user_rank;
  
  `;
  
    const result = await pool.query(query);
    const topUsers = result.rows;
    await RedisService.getClient().setEx(redisKey, ttl, JSON.stringify(topUsers));
  
    return topUsers;

  } catch (err) {
    console.log(err);
    throw err;
  }
};
