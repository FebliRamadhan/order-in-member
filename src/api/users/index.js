import { Router } from 'express';

module.exports = ({ config, db }) => {

  const api = Router();

  api.post('/register', require('./register')({ config, db }));
  api.post('/authentication', require('./authentication')({ config, db }));

  return api;

}