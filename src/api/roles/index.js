import { Router } from 'express';

module.exports = ({ config, db }) => {
  
  const api = Router();

    api.get('/', require('./lists')({ config, db }));
    api.post('/', require('./create')({ config, db }));

  return api;
}