import { Router } from 'express';

export default ({ config, db }) => {

	let api = Router();

	api.use('/users', require('./users')({ config, db }));
	api.use('/roles', require('./roles')({ config, db }));
	api.use('/orders', require('./orders')({ config, db }));
	api.use('/food-server', require('./foodservers')({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
