import Joi from 'joi';
import response from '../../lib/response';
import * as services from '../../services';

module.exports = ({ config, db }) => {

  return (req, res, next) => {
    
    let Users = new services.UserServices({ actor: req.user, config, db });

    Users.logout()
      .then(response.json(res, 200))
      .catch(next);

  }

}