require('dotenv').config();
import express from 'express';
import api from './api';

const app = express();
const port = process.env.PORT || 8080;

app.use('/api', api);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
