import _ from 'lodash';

class OrderServices {

  constructor({ actor, config, db }) {
    this.db = db;
    this.actor = actor;
    this.config = config;
  }

  async create({ orders }) {
    try {
      
      await Promise.all(orders.map(async (item, i) => {
        
        let dataOpt = {
          order_name: item.order_name,
          quantity: item.quantity,
          status: 'waiting',
          user_id: this.actor.sub,
        }
        
        await this.db.orders.create(dataOpt);
        
      }));

      return { 
        statusCode: 200,
        name: 'OrdersCreate', 
        message: 'Orders has been create'
      };

    } catch (error) {
      throw error;
    }
  }

  async lists({ status, limit, page=1, orderBy="DESC" }) {
    try {

      let order = [];
      let offset = (page * limit) - limit;
      let hasNext = true;

      if (orderBy === 'DESC') {
        order =  [['createdAt', 'DESC']]
      } else if (orderBy === 'ASC') {
        order = [['createdAt', 'ASC']];
      }

      let query = {
        // raw: true,
        where: {
          status,
          user_id: this.actor.sub
        },
        include: [{
          attributes: ['username'],
          model: this.db.user,
          as: 'user',
          where: {
            id: this.actor.sub
          }
        }],
        limit,
        offset,
        order
      }
      
      let totalRecord = await this.db.orders.count({ where: { status, user_id: this.actor.sub } });
      
      let totalPage = Math.ceil(totalRecord / limit);

      if (page >= totalPage) hasNext = false;

      let result = await this.db.orders.findAll(query);
      
      return {
        page: totalPage,
        hasNext,
        totalRecord,
        data: result
      };
      
    } catch (error) {
      throw error;
    }
  }

  async listOrders({ status, limit, orderBy='DESC' }) {
    try {

      let orders = [];

      const options = {
        attributes: ['user_id'],
        raw:true,
        group: ['user_id'],
        order: [['user_id', 'ASC']]
      }

      const getUser = await this.db.orders.findAll(options);

      let allUser = _.map(getUser, 'user_id');

      allUser = _.compact(allUser);

      await Promise.all(_(allUser).map(async (item) => {
      
      let query = {
        // raw: true,
        where: {
          user_id: item,
          status
        },
        include: [{
          attributes: ['username'],
          model: this.db.user,
          as: 'user'
        }],
        order: [[ 'createdAt', orderBy ]],
        limit
      }
      
      let orderResult = await this.db.orders.findAll(query);
      let totalRecord = await this.db.orders.count(query);

      if (orderResult.length !== 0) {
        orders.push({
          totalRecord,
          orderResult
        });
      }

    }));
      
      return  {
        statusCode: 200,
        orders
      };

    } catch (error) {
      throw error;
    }
  }

  async acceptOrder({ status }, { orders }) {
    try {

      let orderId = _.map(orders, 'order_id');
          orderId = _.compact(orderId);
      
      await Promise.all(_(orderId).map(async (item) => {

        let options = {
          where: {
            id: item
          }
        }

        let updateOpt = {
          status
        }

        await this.db.orders.update(updateOpt, options);

      }));      
      
      return {
        statusCode: 200,
        name: 'OrderUpdate',
        message: 'Orders has been updated' };

    } catch (error) {
      throw error;
    }
  }

}

module.exports = OrderServices;