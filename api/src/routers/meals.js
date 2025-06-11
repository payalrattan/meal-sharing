import express from 'express';
import knex from '../database_client.js';


const mealsRouter = express.Router();

// Returns all meals in the future
// http://localhost:3000/meals/future-meals

mealsRouter.get('/future-meals', async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal WHERE `when` > NOW()");
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Returns all meals in the past
http://localhost:3000/meals/past-meals
mealsRouter.get('/past-meals', async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal WHERE `when` < NOW()");
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Returns all meals sorted by ID
// http://localhost:3000/meals/all-meals
mealsRouter.get('/all-meals', async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal ORDER BY id");
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Returns the first meal (min id)
//http://localhost:3000/meals/first-meal
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
//http://localhost:3000/meals/last-meal
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
// Returns the given number of meals.
mealsRouter.get('/', async (req, res) => {
  try {
    const { limit } = req.query;
    console.log('limit:', limit);
    let meals;
    if (limit) {
      const limitNum = Number(limit);
      if (isNaN(limitNum)) {
        return res.status(400).json({ error: 'Limit must be a number' });
      }
      [meals] = await knex.raw('SELECT * FROM meal LIMIT ?', [limitNum]);
    } else {
      [meals] = await knex.raw('SELECT * FROM meal');
    }
    res.json(meals);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Returns all meals where the date for when is after the given date.
// http://localhost:3000/meals?afterDate=2023-08-08
  mealsRouter.get('/', async (req, res) => {
  try {
    console.log('Query:', req.query); 

    const { afterDate } = req.query;
    let meals;

    if (afterDate) {
      const dateObj = new Date(afterDate);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
      }

      [meals] = await knex.raw('SELECT * FROM meal WHERE `when` > ?', [afterDate]);
    } else {
      [meals] = await knex.raw('SELECT * FROM meal');
    }

    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Returns all meals where the date for when is before the given date.

mealsRouter.get('/', async (req, res) => {
  try {
    console.log('Query:', req.query); 

    const { beforeDate } = req.query;
    let meals;

    if (beforeDate) {
      const dateObj = new Date(beforeDate);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
      }

      [meals] = await knex.raw('SELECT * FROM meal WHERE `when` < ?', [beforeDate]);
    } else {
      [meals] = await knex.raw('SELECT * FROM meal');
    }

    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default mealsRouter; 