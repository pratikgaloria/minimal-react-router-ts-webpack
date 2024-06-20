import express from "express";
import bodyParser from "body-parser";
//import path from "path";

import apiRouter from "./routes";

const app = express();
app.use(bodyParser.json());
// app.use(express.static(path.resolve("./dist")));

app.use('/', (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return apiRouter(req, res, next);
});

app.listen(8081, () => {
  console.log("API is up and running on http://localhost:8081/");
})