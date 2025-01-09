const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const os = require("os");

dotenv.config();
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST || "localhost";
const MIGRATIONS_PATH = path.resolve(__dirname, "migrations");
const isWindows = os.platform() === "win32";

fs.readdir(MIGRATIONS_PATH, async (err, files) => {
  if (err) {
    console.error("Error reading migrations directory:", err);
    process.exit(1);
  }

  const sqlFiles = files.filter((file) => file.endsWith(".sql"));
  if (sqlFiles.length === 0) {
    console.log("No migration files found.");
    process.exit(0);
  }

  for (const file of sqlFiles) {
    await runMigration(file);
  }

  async function runMigration(file) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(MIGRATIONS_PATH, file);
      const connectToDatabase = file.includes("create-database.sql")
        ? "postgres"
        : DB_NAME;
      const command = `${isWindows ? "set " : ""}PGPASSWORD=${DB_PASSWORD}${
        isWindows ? "&&" : ""
      } psql -U ${DB_USER} -d ${connectToDatabase} -h ${DB_HOST} -f "${filePath}"`;

      console.log(`Running migration: ${file}`);
      exec(command, { shell: true }, (err, stdout, stderr) => {
        if (err) {
          console.error(`Error running migration ${file}:`, err.message);
          reject(err);
          return;
        }
        if (stderr) {
          console.error(`Error output from migration ${file}:`, stderr);
        }
        console.log(`Migration ${file} output:`, stdout);
        resolve();
      });
    });
  }
});
