import Joi from 'joi';
import response from '../../lib/response';
import * as services from '../../services';

module.exports = ({ config, db }) => {

  return (req, res, next) => {

    const schema = Joi.object().keys({
      role_name: Joi.string().required()
    });

    let Roles = new services.RoleServices({ config, db });
    
    Joi.validate(req.body, schema)
      .then( params => {

        Roles.create(params)
          .then(response.json(res, 200))
          .catch(next);

      })
      .catch(next);

  }

}