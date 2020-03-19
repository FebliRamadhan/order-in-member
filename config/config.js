var config = require('config');

const settings = {
  development: {
    username: config.get('mysql.username'),
    password: config.get('mysql.password'),
    database: config.get('mysql.database'),
    host: config.get('mysql.host'),
    dialect: config.get('mysql.dialect'),
    dialectOptions: {}
  }
}

module.exports = settings;