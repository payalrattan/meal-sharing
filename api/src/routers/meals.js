import express from 'express';
import knex from '../database_client.js';


const mealsRouter = express.Router();

// Returns all meals in the future
mealsRouter.get('/future-meals', async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal WHERE `when` > NOW()");
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Returns all meals in the past
mealsRouter.get('/past-meals', async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal WHERE `when` < NOW()");
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Returns all meals sorted by ID
mealsRouter.get('/all-meals', async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal ORDER BY id");
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Returns the first meal (min id)
mealsRouter.get('/first-meal', async (req, res) => {
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

// Returns the last meal (max id)
mealsRouter.get('/last-meal', async (req, res) => {
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

// Returns the meal by id
mealsRouter.get('/:id', async (req, res) => {
  try {
    const [meals] = await knex.raw('SELECT * FROM meal WHERE id = ?', [req.params.id]);
    if (meals.length === 0) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Adds a new meal to the database
mealsRouter.post('/', async (req, res) => {
  try {
    await knex('meal').insert(req.body);
    res.status(201).json({ Message: 'Meal created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Updates the meal by id
mealsRouter.put('/:id', async (req, res) => {
  try {
    const updated = await knex('meal').where({ id: req.params.id }).update(req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    res.json({ message: 'Meal updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletes the meal by id
mealsRouter.delete('/:id', async (req, res) => {
  try {
    const deleted = await knex('meal').where({ id: req.params.id }).del();
    if (!deleted) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    res.json({ message: 'Meal deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 	Returns all meals that are cheaper than maxPrice.
mealsRouter.get('/price', async (req, res) => {
  try {
    const { maxPrice } = req.query;
    console.log('maxPrice:', maxPrice);
    let meals;
    if (maxPrice) {
      const priceNum = Number(maxPrice);
      if (isNaN(priceNum)) {
        return res.status(400).json({ error: 'maxPrice must be a number' });
      }
      [meals] = await knex.raw('SELECT * FROM meal WHERE price < ?', [priceNum]);
    } else {
      [meals] = await knex.raw('SELECT * FROM meal');
    }
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default mealsRouter;