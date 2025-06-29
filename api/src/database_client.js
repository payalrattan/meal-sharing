import "dotenv/config";
console.log('DB_CLIENT:', process.env.DB_CLIENT);
import knex from "knex";

const connection = knex({
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    ssl:
      process.env.DB_USE_SSL === "true" ? { rejectUnauthorized: false } : false,
  },
});
// Test the database connection
connection.raw('SELECT VERSION()').then(() => {
  console.log('Database connection successful');
}).catch((error) => {
  console.error('Database connection failed:', error);
}); 


export default connection;
