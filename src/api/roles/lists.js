import Joi from 'joi';
import response from '../../lib/response';
import * as services from '../../services';

module.exports = ({ config, db }) => {

  return (req, res, next) => {

    const schema = Joi.object().keys({
      limit: Joi.number().integer().default(5),
      page: Joi.number().integer(),
      orderBy: Joi.string().valid('ASC', 'DESC'),
    });

    let Roles = new services.RoleServices({ config, db });
    
    Joi.validate(req.query, schema)
      .then( params => {

        Roles.lists(params)
          .then(response.json(res, 200))
          .catch(next);
          
      })
      .catch(next);

  }

}