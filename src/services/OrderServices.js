
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

      return { name: 'OrdersCreate', message: 'Orders has been create'};

    } catch (error) {
      throw error;
    }
  }

  async lists({ status, limit, page, orderBy }) {
    try {

      let order = [];
      let offset = 0;
      if (page) {
        offset = limit * (page - 1);
      }

      if (orderBy === 'DESC') {
        order =  [['createdAt', 'DESC']]
      } else if (orderBy === 'ASC') {
        order = [['createdAt', 'ASC']];
      }

      let query = {
        raw: true,
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

      let result = await this.db.orders.findAll(query);
      console.log(result);
      
      return result;
      
    } catch (error) {
      throw error;
    }
  }

}

module.exports = OrderServices;