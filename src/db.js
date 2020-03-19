import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import winston from './lib/winston';

require('sequelize-hierarchy')(Sequelize);

module.exports = (config, callback) => {
	
	let basename = path.basename(module.filename);
	let db = {};
	let pathModel = `${__dirname}/models`;
	let setting = {
    host: config.get('mysql.host'),
    dialect : config.get('mysql.dialect'),
    port: config.get('mysql.port'),
    logging: false
	};
	
	const sequelize = new Sequelize(config.get('mysql.database'), config.get('mysql.username'), config.get("mysql.password"), setting);

	sequelize
		.authenticate()
		.then(() => {

			fs
				.readdirSync(pathModel)
				.filter(file => {
					return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
				})
				.forEach(file => {
					var model = sequelize['import'](path.join(pathModel, file));
					db[model.name] = model;
				});
			
				Object.keys(db).forEach((modelName) => {
					if (db[modelName].associate) {
						db[modelName].associate(db);
					}
				});
				
				db.sequelize = sequelize;
				db.Sequelize = Sequelize;

				winston.log('info','connection database has been established successfully');
				callback(null, db);

		})
		.catch(err => {
			winston.log('info', `unable to connect to the databse callback throw error ${err.message}`);
			callback(err);
		});

};

