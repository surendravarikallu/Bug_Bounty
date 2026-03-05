const { Client } = require('pg');
require('dotenv').config();

async function initDB() {
  const dbClient = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await dbClient.connect();
    console.log('Connected to PostgreSQL server.');

    console.log('Creating tables...');
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL, -- Intentionally plain text for Vuln 7
        role VARCHAR(20) DEFAULT 'user'
      );
    `);

    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        filename VARCHAR(255) NOT NULL,
        filepath VARCHAR(255) NOT NULL
      );
    `);

    console.log('Seeding initial data...');
    // Seed admin user
    await dbClient.query(`
      INSERT INTO users (username, email, password, role) 
      VALUES ('admin', 'admin@bugbounty.local', 'admin123', 'admin')
      ON CONFLICT (username) DO NOTHING;
    `);

    // Seed dummy user
    await dbClient.query(`
      INSERT INTO users (username, email, password, role) 
      VALUES ('user1', 'user1@bugbounty.local', 'password123', 'user')
      ON CONFLICT (username) DO NOTHING;
    `);

    console.log('Database initialization completed successfully.');
    await dbClient.end();
  } catch (err) {
    console.error('Error during database initialization:', err);
  }
}

initDB();
