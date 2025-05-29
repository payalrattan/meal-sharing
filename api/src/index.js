import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

// // You can delete this route once you add your own routes
// apiRouter.get("/", async (req, res) => {
//   const SHOW_TABLES_QUERY =
//     process.env.DB_CLIENT === "pg"
//       ? "SELECT * FROM pg_catalog.pg_tables;"
//       : "SHOW TABLES;";
//   const tables = await knex.raw(SHOW_TABLES_QUERY);
//   res.json({ tables });
// });

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

// /future-meals: Meals in the future
apiRouter.get("/future-meals", async (req, res) => {
  try {
    const meals = await knex("meals").where("when", ">", knex.fn.now());
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// /past-meals: Meals in the past
apiRouter.get("/past-meals", async (req, res) => {
  try {
    const meals = await knex("meals").where("when", "<", knex.fn.now());
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// /all-meals: All meals sorted by id
apiRouter.get("/all-meals", async (req, res) => {
  try {
    const meals = await knex("meals").orderBy("id");
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// /first-meal: Meal with the minimum id
apiRouter.get("/first-meal", async (req, res) => {
  try {
    const meal = await knex("meals").orderBy("id").first();
    res.json(meal || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// /last-meal: Meal with the maximum id
apiRouter.get("/last-meal", async (req, res) => {
  try {
    const meal = await knex("meals").orderBy("id", "desc").first();
    res.json(meal || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
