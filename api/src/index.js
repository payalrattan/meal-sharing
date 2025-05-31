import "dotenv/config";
import express from 'express';
import knex from './database_client.js';

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

app.get('/future-meals', async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal WHERE `when` > NOW()");
    console.log(meals); // Log the result rows
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// /past-meals: Meals in the past
app.get('/past-meals', async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal WHERE `when` < NOW()");
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// /all-meals: All meals sorted by id
app.get('/all-meals', async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal ORDER BY id");
    res.json(meals); // returns [] if no meals
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// /first-meal: Meal with the minimum id
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

// /last-meal: Meal with the maximum id
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

// POST route to insert data
app.post('/mealsinfo', async (req, res) => {
  const meals = req.body.meal;
  if (!Array.isArray(meals) || meals.length === 0) {
    return res.status(400).send('Request body must have a non-empty "meal" array');
  }
  try {
    await knex("meal").insert(meals);
    res.send('Meals saved successfully');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error saving data');
  }
});

const meals = await knex.raw("SELECT * FROM Meal");
console.log(meals);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});