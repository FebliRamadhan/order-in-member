

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
        name: 'SuccessCreate',
        message: 'Data successfully insert to database'
      }
      
    } catch (error) {
      throw error;
    }

  }

  async lists() {

    try {
      
      const lists = await this.db.roles.findAll();

      return lists;

    } catch (error) {
      throw error;
    }
    
  }

}

module.exports = RoleServices;