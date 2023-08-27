import { pool } from "../../config";

async function up() {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
  );`;

  const createIndexQuery = `
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
`;
  try {
    await pool.query(createTableQuery);
    await pool.query(createIndexQuery);
    console.log("Created users table");
  } catch (error) {
    console.error("Error creating users table:", error);
    throw error;
  }
}

async function down() {
  const dropTableQuery = `
    DROP TABLE IF EXISTS users CASCADE;
  `;

  try {
    await pool.query(dropTableQuery);
    console.log("Dropped users table");
  } catch (error) {
    console.error("Error dropping users table:", error);
    throw error;
  }
}

export { up, down };
