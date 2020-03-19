import fs from 'fs';
import md5 from 'md5';
import jwt from 'jsonwebtoken';

class UserServices {

  constructor ({ config, db}) {

      this.config = config;
      this.db = db;
  }

  async register({ username, password, roles_id }) {

    try {    

      const query = {
        where: {
          username
        }
      }
      
      let checkUser = await this.db.user.findOne(query);

      if (checkUser ) {
        throw { name: 'UserExist', message: 'User already register'};
      }

      let register = {
        username,
        roles_id,
        password: md5(password)
      }

      const users = await this.db.user.create(register);

      let payload = {
        sub: users.id
      }

      const token = jwt.sign(payload, fs.readFileSync('private'), { algorithm: 'RS256' });

      
      return { username, token};
      
      
    } catch (error) {
      throw error;
    }   
  }

  async authentication({ username, password }) {

    try {
      
      const query = {
        attributes: ['username', 'roles_id'],
        where: {
          username
        }
      }

      let user = await this.db.user.findOne(query);
      
      if (!user) {
        throw { name: 'UserNotFound', message: 'User is  not register'};
      }

      if (!user.password === md5(password)) {
        throw { name: 'WrongPassword', message: 'Wrong Password'}
      }

      let payload = {
        sub: user.id
      }

      const token = jwt.sign(payload, fs.readFileSync('private'), { algorithm: 'RS256' });

      query.include = {
        attributes: ['role_name'],
        model: this.db.roles,
        as: 'roles',
        where: {
          id: user.roles_id
        }
      }

      user = await this.db.user.findOne(query);
      
      return { user, token };

    } catch (error) {
      throw error;
    }

  }

}

module.exports = UserServices;