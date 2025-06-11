import "dotenv/config";
import express from 'express';
import mealsRouter from "./routers/meals.js";
import reservationRouter from './routers/reservations.js';
import reviewRouter from './routers/reviews.js';
// Initialize the Express application
const app = express();
const port = process.env.PORT || 3000;
// Middleware
app.use(express.json());

// Routers
app.use('/meals', mealsRouter);
app.use('/reservations', reservationRouter);
app.use('/reviews', reviewRouter);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});