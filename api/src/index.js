import "dotenv/config";
import express from 'express';
import knex from './database_client.js';
import mealsRouter from "./routers/meals.js";
import reservationRouter from './routers/reservations.js';

// Test database connection
knex.raw('SELECT 1')
  .then(() => {
    console.log('Database connection successful!');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Test GET route
app.get('/', async (req, res) => {
  const [rows] = await knex.raw('SELECT VERSION()');
  res.json({
    nodeVersion: process.version,
    mysqlVersion: rows[0]['VERSION()']
  });
});

// Routers
app.use('/meals', mealsRouter);
app.use('/reservations', reservationRouter);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});