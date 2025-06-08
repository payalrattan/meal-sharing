import "dotenv/config";
import express from 'express';
import knex from './database_client.js';
import mealsRouter from "./routers/meals.js";
import reservationRouter from './routers/reservations.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());



// Routers
app.use('/meals', mealsRouter);
app.use('/reservations', reservationRouter);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});