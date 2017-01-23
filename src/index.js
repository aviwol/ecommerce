require('dotenv').config();
import express from 'express';
import searchEbay from './modules/ebay.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(searchEbay.searchEbay);

app.get('/', searchEbay.searchEbay);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
