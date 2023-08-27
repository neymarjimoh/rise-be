import * as fs from "fs";
import path from "path";
import { pool } from "../config";

// Run 'up' function for each migration
async function runMigrations() {
  // Read all migration files in the directory
  const migrationFiles = fs.readdirSync(path.join(__dirname, "migrations"));
  migrationFiles.sort();

  for (const migrationFile of migrationFiles) {
    const migrationModule = require(path.join(
      __dirname,
      "migrations",
      migrationFile
    ));
    await migrationModule.up();
    console.log(`Migration ${migrationFile} applied.`);
  }
}

// Run migrations
runMigrations()
  .then(() => {
    console.log("Migrations completed");
    pool.end();
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error running migrations:", error);
    pool.end();
    process.exit(1);
  });
