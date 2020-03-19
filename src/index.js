import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import winston from './lib/winston';
import api from './api';
import config from 'config';

global.logger = winston;

let app = express();

app.server = http.createServer(app);

// logger
app.use(morgan('combined', { stream: winston.stream}));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

// connect to db
initializeDb(config, (error, db) => {

	if (error) throw error;
	
	// api router
	app.use('/api', api({ config, db }));

	app.use((error, req, res, next) => {
		console.log(error);
		winston.log('info', { level: 'error', message: error.message, metadata: error });
		if (error.code) return res.status(400).json(error);
		if (error.status) return res.status(400).json(error);
		if (error) return res.status(error.statusCode || 400).json({ statusCode: error.statusCode, name: error.name, message: error.message });
		
		return res.status(error.statusCode || 500).send(error);
		
	});

	app.server.listen(process.env.PORT || config.port, () => {
		winston.log('info',`Started on port ${app.server.address().port}`);
	});

});

export default app;
