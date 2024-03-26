import express from "express";
import path from "path";
import apiRouter from "./routes";

const app = express();
app.use(express.static(path.resolve("./dist")));

app.use('/api', apiRouter);

app.listen(8080, () => {
  console.log("API is up and running on http://localhost:8080/api");
})