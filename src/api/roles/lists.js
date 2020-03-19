import Joi from 'joi';
import response from '../../lib/response';
import * as services from '../../services';

module.exports = ({ config, db }) => {

  return (req, res, next) => {

    let Roles = new services.RoleServices({ config, db });
    
    Joi.validate()
      .then( () => {

        Roles.lists()
          .then(response.json(res, 200))
          .catch(next);
          
      })
      .catch(next);

  }

}