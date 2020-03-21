

class RoleServices {

  constructor ({ config, db }) {
    this.db = db;
    this.config = config;
  }

  async create({ role_name }) {
    try {

      let dataOpt = {
        role_name
      }

      await this.db.roles.create(dataOpt);

      return {
        statusCode: 200,
        name: 'SuccessCreate',
        message: 'Data successfully insert to database'
      }
      
    } catch (error) {
      throw error;
    }

  }

  async lists({ limit, page=1, orderBy="DESC"}) {

    try {
      
      let offset = (page * limit) - limit;
      let hasNext = true;

      const query = {
        limit,
        offset,
        order: [['createdAt', orderBy]]
      }

      const lists = await this.db.roles.findAll(query);
      const totalRecord = await this.db.roles.count();
      
      let totalPage = Math.ceil(totalRecord / limit);

      if (page >= totalPage) hasNext = false;
      console.log(totalPage);
      
      return {
        page: totalPage,
        hasNext,
        totalRecord,
        data: lists
      };

    } catch (error) {
      throw error;
    }
    
  }

}

module.exports = RoleServices;