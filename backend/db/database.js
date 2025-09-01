const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      avatar TEXT,
      joinDate TEXT,
      bio TEXT,
      posts TEXT, -- Store as JSON string of post IDs
      likedPosts TEXT, -- Store as JSON string of post IDs
      downvotedPosts TEXT -- Store as JSON string of downvoted post IDs
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT,
      content TEXT,
      type TEXT,
      authorId TEXT,
      createdAt TEXT,
      upvotes INTEGER,
      downvotes INTEGER,
      comments TEXT, -- Store as JSON string of comments
      image TEXT
    )`);

    console.log('Tables created or already exist.');
  }
});

module.exports = db;
