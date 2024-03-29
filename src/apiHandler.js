import express from 'express';
import cors from 'cors';
import { getVillainQuote } from './database.js';

const port = 8000;

const app = express();
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/quote/villain', async (req, res) => {
  const villain = await getVillainQuote();
  const data = {
    name: villain.name,
    quote: villain.quote
  };
  
  res.json(data);
});

app.listen(port, () => console.log(`Listening on port ${port}`));