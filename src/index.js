require('dotenv').config();
import express from 'express';
import path from 'path';
import api from './api';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '../client/build')));

app.use('/api', api);

app.get('/', (req, res) => {
  res.sendfile('index.html');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
