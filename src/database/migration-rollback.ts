import fs from "fs";
import path from "path";
import { pool } from "../config";

async function rollbackLastMigration() {
  const migrationFiles = fs.readdirSync(path.join(__dirname, "migrations"));
  migrationFiles.sort();

  for (const file of migrationFiles) {
    const lastMigration = require(path.join(__dirname, `migrations/${file}`));

    console.log(`Rolling back migration: ${file}`);
    await lastMigration.down();
  }
}

rollbackLastMigration()
  .then(() => {
    console.log("Rollback completed");
    pool.end();
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error rolling back migration:", error);
    pool.end();
    process.exit(1);
  });
