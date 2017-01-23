import express from 'express';
import search from './search';

const apiRoutes = express.Router();

apiRoutes.get('/search', search);

export default apiRoutes;
