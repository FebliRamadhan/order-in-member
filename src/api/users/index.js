import { Router } from 'express';
import verify from '../../lib/verfiy';

module.exports = ({ config, db }) => {

  const api = Router();

  api.post('/register', require('./register')({ config, db }));
  api.post('/authentication', require('./authentication')({ config, db }));
  api.post('/logout', verify, require('./logout')({ config, db }));

  return api;

}