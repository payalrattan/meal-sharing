import express from 'express';
import knex from '../database_client.js';

const reservationRouter = express.Router();

// Returns all meals
reservationRouter.get('/', async (req, res) => {
    try {
        const [reservation] = await knex.raw('SELECT * FROM reservation');
        res.json(reservation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//Returns a reservation by id
reservationRouter.get('/:id', async (req, res) => {
    try {
        const [reservation] = await knex.raw('select * from reservation where id = ?', [req.params.id]);
        res.json(reservation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//Adds a new reservation to the database
reservationRouter.post('/', async (req, res) => {
    try {
        await knex('reservation').insert(req.body);
        res.status(201).json({ Message: 'Reservation created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Updates the reservation by id
reservationRouter.put('/:id', async (req, res) => {
    try {
        const updated = await knex('reservation').where({ id: req.params.id }).update(req.body);
        if (!updated) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.json({ message: 'Reservation updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Deletes the reservation by id
reservationRouter.delete('/:id', async (req, res) => {
    try {
        const deleted = await knex('reservation').where({ id: req.params.id }).del();
        if (!deleted) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.json({ message: 'Reservation deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default reservationRouter;