import Database from "@tauri-apps/plugin-sql";

export async function setupDatabase() {
  // Open a connection to the SQLite database
  const db = await Database.load("sqlite:mydb.db");

  // Create a table
  await db.select(
    `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT NOT NULL);`,
    []
  );

  // Insert a record
  await db.execute(`INSERT INTO users (name) VALUES (?);`, ["Alice"]);

  // Select data
  const result = await db.select(`SELECT * FROM users;`, []);
  console.log(result);
}

setupDatabase().catch(console.error);
