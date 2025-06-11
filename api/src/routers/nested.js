import express from "express";

//test router
const nestedRouter = express.Router();

nestedRouter.get("/after", (req, res) => {
  res.json({ message: "Hello nested router" });
});

export default nestedRouter;
