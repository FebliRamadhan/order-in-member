'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    roles_id: DataTypes.INTEGER
  }, {});
  user.associate = function(models) {
    this.belongsTo(models.roles, {
      as: 'roles',
      foreignKey: 'roles_id'
    })
  };
  return user;
};