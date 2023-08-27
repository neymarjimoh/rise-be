import { pool } from "../../config";

async function up() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ,
      user_id INT REFERENCES users(id)
    );

    -- Create index on user_id field
    CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Post table created");
  } catch (error) {
    console.error("Error creating post table:", error);
    throw error;
  }
}

async function down() {
  const dropTableQuery = `
    DROP TABLE IF EXISTS posts CASCADE;
  `;

  try {
    await pool.query(dropTableQuery);
    console.log("Dropped posts table");
  } catch (error) {
    console.error("Error dropping posts table:", error);
    throw error;
  }
}

export { up, down };
