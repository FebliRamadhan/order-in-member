import { Router } from 'express';
import verify from '../../lib/verfiy';

module.exports = ({ config, db } ) => {

  const api = Router();

  api.get('/', verify,require('./lists')({ config, db }));
  api.post('/', verify, require('./create')({ config, db }));

  return api;

}