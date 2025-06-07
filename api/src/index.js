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
const port = 5000;

app.use(express.json()); // Needed to parse JSON body

// Test GET route
app.get('/', async (req, res) => {
  const [rows] = await knex.raw('SELECT VERSION()');
  res.json({
    nodeVersion: process.version,
    mysqlVersion: rows[0]['VERSION()']
  });
});

//Respond with all meals in the future (relative to the when datetime)

app.get('/future-meals', async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal WHERE `when` > NOW()");
    console.log(meals); // Log the result rows
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//Respond with all meals in the past (relative to the when datetime)
app.get('/past-meals', async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal WHERE `when` < NOW()");
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Respond with all meals sorted by ID
app.get('/all-meals', async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal ORDER BY id");
    res.json(meals); // returns [] if no meals
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Respond with the first meal (meaning with the minimum id)
app.get('/first-meal', async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal ORDER BY id ASC LIMIT 1");
    if (!meals.length) {
      return res.status(404).json({ error: "There are no meals." });
    }
    res.json(meals[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Respond with the last meal (meaning with the maximum id)

app.get('/last-meal', async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal ORDER BY id DESC LIMIT 1");
    if (!meals.length) {
      return res.status(404).json({ error: "There are no meals." });
    }
    res.json(meals[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//routers 
app.use('/meals', mealsRouter);
app.use('/reservations', reservationRouter);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});