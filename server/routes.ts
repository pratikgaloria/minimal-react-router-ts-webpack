import express from "express";
import { db } from "./db";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("API is up and running!");
});

router.get("/investments", (req, res) => {
  db.investments.getAll().then((data) => {
    res.json(data);
  })
})

router.get("/returns", (req, res) => {
  db.returns.getAll().then((data) => {
    res.json(data);
  });
});

export default router;
