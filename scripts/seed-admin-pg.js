const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const dbUrl = "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";

async function seed() {
  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    const email = 'admin@gmail.com';
    const password = 'admin123';
    const hashed = await bcrypt.hash(password, 12);
    const id = 'admin_' + Date.now();

    const res = await client.query('SELECT * FROM "User" WHERE email = $1', [email]);
    if (res.rows.length > 0) {
      await client.query('UPDATE "User" SET role = $1, password = $2 WHERE email = $3', ['ADMIN', hashed, email]);
      console.log('User promoted to ADMIN');
    } else {
      await client.query(
        'INSERT INTO "User" (id, name, email, password, role, "createdAt") VALUES ($1, $2, $3, $4, $5, $6)',
        [id, 'Admin', email, hashed, 'ADMIN', new Date()]
      );
      console.log('Admin user created');
    }
  } catch (err) {
    console.error('Error during seed:', err);
  } finally {
    await client.end();
  }
}

seed();
