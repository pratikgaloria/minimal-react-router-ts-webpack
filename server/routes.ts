import express from "express";
import { db } from "./db";
import { TInvestment } from "./collections/investments";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("API is up and running!");
});

router.get("/investments", (req, res) => {
  db.investments
    .getAll()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error(error);
    });
});

router.post("/investments", (req, res) => {
  const { investment } = req.body;
  db.investments
    .insert(investment as Omit<TInvestment, "_id">)
    .then((data) => {
      db.investments.fetch().then(() => {
        res.status(201).json({
          success: true,
          data,
        });
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(409).json({
        success: false,
        errorCode: error.code,
        message:
          error.code === 11000
            ? `${investment.symbol} already exists.`
            : error.message,
      });
    });
});

router.put("/investments/:symbol", (req, res) => {
  const { symbol } = req.params;

  db.investments
    .update(symbol, req.body)
    .then(() => {
      db.investments.fetch().then(() => {
        res.status(201).json({
          success: true,
          data: req.body,
        });
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        success: false,
        errorCode: error.code,
        message: error.message,
      });
    });
});

router.delete("/investments/:symbol", (req, res) => {
  db.investments
    .delete(req.params.symbol)
    .then(() => {
      db.investments.fetch().then(() => {
        res.status(201).json({
          success: true,
        });
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        success: false,
        errorCode: error.code,
        message: error.message,
      });
    });
});

router.get("/returns", (req, res) => {
  db.returns
    .getAll()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    });
});

router.get("/update", (req, res) => {
  // const exchanges: Record<string, string> = {
  //   "FSLR": "NASDAQ:FSLR",
  //   "GTLB": "NASDAQ:GTLB",
  //   "GFAI": "NASDAQ:GFAI",
  //   "HYUD.IL": "LSIN:HYUD",
  //   "JOBY": "NYSE:JOBY",
  //   "MCD": "NYSE:MCD",
  //   "META": "NASDAQ:META",
  //   "MSFT": "NASDAQ:MSFT",
  //   "NFLX": "NASDAQ:NFLX",
  //   "NKE": "NYSE:NKE",
  //   "NIO": "NYSE:NIO",
  //   "NVO": "NYSE:NVO",
  //   "NVDA": "NASDAQ:NVDA",
  //   "PLTR": "NYSE:PLTR",
  //   "PLUG": "NASDAQ:PLUG",
  //   "QCOM": "NASDAQ:QCOM",
  //   "RBLX": "NYSE:RBLX",
  //   "ROKU": "NASDAQ:ROKU",
  //   "CRM": "NYSE:CRM",
  //   "S": "NYSE:S",
  //   "SNOW": "NYSE:SNOW",
  //   "SPOT": "NYSE:SPOT",
  //   "TSM": "NYSE:TSM",
  //   "TSLA": "NASDAQ:TSLA",
  //   "PATH": "NYSE:PATH",
  //   "U": "NYSE:U",
  //   "VUSA.L": "LSE:VUSA",
  //   "VKTX": "NASDAQ:VKTX",
  //   "SPCE": "NYSE:SPCE",
  //   "ZS": "NASDAQ:ZS",
  //   "QUIK": "NASDAQ:QUIK",
  //   "PYPL": "NASDAQ:PYPL",
  //   "ADBE": "NASDAQ:ADBE",
  // };
  // Promise.all(Object.keys(exchanges).map(e => {
  //   return db.investments.append(e, { tvSymbol: exchanges[e] as string })
  // })).then(() => {
  //   res.json({
  //     success: true,
  //   });
  // }).catch((error) => {
  //   console.error(error);
  //   res.status(500).json({
  //     success: false,
  //     message: error.message,
  //   })
  // })
});

export default router;
