import fs from 'fs';

const getInstruments = async () => {
  const response = await fetch(
    `https://live.trading212.com/api/v0/equity/metadata/instruments`,
    {
      method: "GET",
      headers: {
        Authorization: '21938801ZczAEXiRKKLnMQUncuwbqYmWlRETE',
      }
    }
  );
  
  fs.writeFileSync(
    `./server/data/trading212-instruments.json`,
    JSON.stringify(await response.json())
  );
}

getInstruments();