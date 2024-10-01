import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import log from "npmlog";

import apiRouter from "./routes";
import { Investments } from "./collections/investments";

const app = express();
app.use(bodyParser.json());
// app.use(express.static(path.resolve("./dist")));

app.use("/", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return apiRouter(req, res, next);
});

Investments.fetch()
  .then(() => {
    app.listen(8081, () => {
     log.info("Server", "Listening on port 8081");
    });
  })
  .catch((error) => {
    log.error("Server", "Failed to fetch investments", error);
  });
