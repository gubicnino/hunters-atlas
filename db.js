const postgres = require('postgres');

const connectionString = process.env.DATABASE_URL;
console.log('Connecting to database with connection string:', connectionString);
const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false }  // Add this for Vercel
});
module.exports = sql;