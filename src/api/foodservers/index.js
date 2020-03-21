import { Router } from 'express';
import verify from '../../lib/verfiy';

module.exports = ({ config, db }) => {

  const api = Router();

  api.get('/', require('./lists')({ config, db }));
  api.post('/:status', verify, require('./create')({ config, db }));

  return api;

}