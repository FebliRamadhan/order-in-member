'use strict';
module.exports = (sequelize, DataTypes) => {
  const accessTokens = sequelize.define('accessTokens', {
    token: DataTypes.TEXT,
    user_id: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {});
  accessTokens.associate = function(models) {
    // associations can be defined here
  };
  return accessTokens;
};