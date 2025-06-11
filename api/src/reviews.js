import express from 'express';
import knex from '../database_client.js';

const reviewRouter = express.Router();

// Adds a new review to the database.
reviewRouter.post('/', async (req, res) => {
    try {
        const { title, description, meal_id, stars, created_date } = req.body;
        if (!title || !description || !meal_id || !stars || !created_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        await knex('review').insert({ title, description, meal_id, stars, created_date });
        res.status(201).json({ message: 'Review created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /reviews - Returns all reviews
reviewRouter.get('/', async (req, res) => {
    try {
        const [reviews] = await knex.raw('SELECT * FROM review');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Returns a review by id.
reviewRouter.get('/:id', async (req, res) => {
    try {
        const [reviews] = await knex.raw('SELECT * FROM review WHERE id = ?', [req.params.id]);
        if (reviews.length === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json(reviews[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Updates the review by id
reviewRouter.put('/:id', async (req, res) => {
    try {
        const updated = await knex('review').where({ id: req.params.id }).update(req.body);
        if (!updated) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json({ message: 'Review updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Deletes the review by id
reviewRouter.delete('/:id', async (req, res) => {
    try {
        const deleted = await knex('review').where({ id: req.params.id }).del();
        if (!deleted) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default reviewRouter;

