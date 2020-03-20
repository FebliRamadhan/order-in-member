'use strict';
module.exports = (sequelize, DataTypes) => {
  const orders = sequelize.define('orders', {
    order_name: DataTypes.STRING,
    quantity: DataTypes.NUMBER,
    status: DataTypes.ENUM('waiting', 'accepted', 'rejected'),
    user_id: DataTypes.STRING
  }, {});

  orders.associate = function(models) {
    this.belongsTo(models.user, {
      as: 'user',
      foreignKey: 'user_id',
    });
  }
  
  return orders;
};