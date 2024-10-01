import express from "express";
import { Investments } from "./collections/investments";
import { Returns } from "./collections/returns";
import log from "npmlog";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Welcome to the investments API!",
  });
});

router.get("/investments", (req, res) => {
  Investments.get()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      log.error("Routes", "GET /investments", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    });
});

router.get("/returns", (req, res) => {
  Returns.get()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      log.error("Routes", "GET /returns", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    });
});

/*
router.get("/update", (req, res) => {
  const exchanges: Record<string, string> = {
    "FSLR": "NASDAQ:FSLR",
    "GTLB": "NASDAQ:GTLB",
    "GFAI": "NASDAQ:GFAI",
    "HYUD.IL": "LSIN:HYUD",
    "JOBY": "NYSE:JOBY",
    "MCD": "NYSE:MCD",
    "META": "NASDAQ:META",
    "MSFT": "NASDAQ:MSFT",
    "NFLX": "NASDAQ:NFLX",
    "NKE": "NYSE:NKE",
    "NIO": "NYSE:NIO",
    "NVO": "NYSE:NVO",
    "NVDA": "NASDAQ:NVDA",
    "PLTR": "NYSE:PLTR",
    "PLUG": "NASDAQ:PLUG",
    "QCOM": "NASDAQ:QCOM",
    "RBLX": "NYSE:RBLX",
    "ROKU": "NASDAQ:ROKU",
    "CRM": "NYSE:CRM",
    "S": "NYSE:S",
    "SNOW": "NYSE:SNOW",
    "SPOT": "NYSE:SPOT",
    "TSM": "NYSE:TSM",
    "TSLA": "NASDAQ:TSLA",
    "PATH": "NYSE:PATH",
    "U": "NYSE:U",
    "VUSA.L": "LSE:VUSA",
    "VKTX": "NASDAQ:VKTX",
    "SPCE": "NYSE:SPCE",
    "ZS": "NASDAQ:ZS",
    "QUIK": "NASDAQ:QUIK",
    "PYPL": "NASDAQ:PYPL",
    "ADBE": "NASDAQ:ADBE",
  };
  Promise.all(Object.keys(exchanges).map(e => {
    return db.investments.append(e, { tvSymbol: exchanges[e] as string })
  })).then(() => {
    res.json({
      success: true,
    });
  }).catch((error) => {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    })
  })
});
*/

export default router;
