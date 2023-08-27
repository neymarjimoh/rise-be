import { pool } from "../../config";

async function up() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ,
      post_id INT REFERENCES posts(id),
      "user_id" INT REFERENCES users(id) ON DELETE SET NULL
    );

    -- Create index on user_id field
    CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

    -- Create index on post_id field
    CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Comment table created");
  } catch (error) {
    console.error("Error creating comment table:", error);
    throw error;
  }
}

async function down() {
  const dropTableQuery = `
    DROP TABLE IF EXISTS comments CASCADE;
  `;

  try {
    await pool.query(dropTableQuery);
    console.log("Dropped comments table");
  } catch (error) {
    console.error("Error dropping comments table:", error);
    throw error;
  }
}

export { up, down };
