const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let db;

async function initializeDatabase() {
  db = await open({
    filename: path.join(__dirname, 'fruit_app.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );

    CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        quiz_score INTEGER,
        total_questions INTEGER DEFAULT 5,
        last_quiz_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Add total_questions column if it doesn't exist (for existing databases)
  try {
    await db.run('ALTER TABLE progress ADD COLUMN total_questions INTEGER DEFAULT 5');
  } catch (e) {
    // Column already exists, ignore error
  }

  console.log('Database initialized');
  return db;
}

function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

module.exports = { initializeDatabase, getDatabase };
