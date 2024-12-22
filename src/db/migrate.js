const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const os = require("os");

dotenv.config();
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD;
const MIGRATIONS_PATH = path.resolve(__dirname, "migrations");
const isWindows = os.platform() === "win32";

fs.readdir(MIGRATIONS_PATH, (err, files) => {
  if (err) {
    console.error("Error reading migrations directory:", err);
    process.exit(1);
  }

  const sqlFiles = files.filter((file) => file.endsWith(".sql"));
  if (sqlFiles.length === 0) {
    console.log("No migration files found.");
    process.exit(0);
  }

  sqlFiles.forEach((file) => {
    const filePath = path.join(MIGRATIONS_PATH, file);
    const command = `${
      isWindows ? "set " : ""
    }PGPASSWORD=${DB_PASSWORD}&& psql -U ${DB_USER} -d ${DB_NAME} -f "${filePath}"`;

    console.log(`Running migration: ${file}`);
    exec(command, { shell: true }, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error running migration ${file}:`, err.message);
        return;
      }
      if (stderr) {
        console.error(`Error output from migration ${file}:`, stderr);
      }
      console.log(`Migration ${file} output:`, stdout);
    });
  });
});
