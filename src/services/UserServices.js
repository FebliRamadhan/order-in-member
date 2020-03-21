import fs from 'fs';
import md5 from 'md5';
import jwt from 'jsonwebtoken';

class UserServices {

  constructor ({ actor, config, db}) {

    this.db = db;
    this.actor = actor;
    this.config = config;
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
        throw { statusCode: 400, name: 'UserExist', message: 'User already register'};
      }

      let options = {
        username,
        roles_id,
        password: md5(password)
      }

      const users = await this.db.user.create(options);

      let payload = {
        sub: users.id
      }
      
      const token = jwt.sign(payload, fs.readFileSync('private'), { algorithm: 'RS256' });

      let tokenOpt = {
        token,
        user_id: users.id,
        active: true
      }
      
      await this.db.accessTokens.create(tokenOpt);

      return { statusCode: 200, users, token };
      
      
    } catch (error) {
      throw error;
    }   
  }

  async authentication({ username, password }) {

    try {
      
      const query = {
        attributes: ['id', 'username', 'roles_id'],
        where: {
          username
        }
      }

      let user = await this.db.user.findOne(query);
      
      if (!user) {
        throw { statusCode: 400, name: 'UserNotFound', message: 'User is  not register'};
      }

      if (!user.password === md5(password)) {
        throw { statusCode: 400, name: 'WrongPassword', message: 'Wrong Password'}
      }

      let token = await this.db.accessTokens.findOne({ where: { user_id: user.id}});
      
      if (!token.active) {
        await this.db.accessTokens.update({ active: true }, { where: { user_id: user.id }});
      }
      
      token = token.token;
      
      query.include = {
        attributes: ['role_name'],
        model: this.db.roles,
        as: 'roles',
        where: {
          id: user.roles_id
        }
      }

      user = await this.db.user.findOne(query);
      
      return { statusCode: 200, user, token };

    } catch (error) {
      throw error;
    }

  }

  async logout() {
    try {
      console.log(this.actor);
      
      let options = {
        where: {
          user_id: this.actor.sub
        }
      }

      let updateOpt = {
        active: false
      }

      await this.db.accessTokens.update(updateOpt, options);

      return { statusCode: 200, name: 'LogoutSuccess', message: 'User success logout' };

    } catch (error) {
     throw error; 
    }
  }

}

module.exports = UserServices;