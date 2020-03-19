import Joi from 'joi';
import response from '../../lib/response';
import * as services from '../../services';

module.exports = ({ config, db }) => {

  return (req, res, next) => {

    const schema = Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
      roles_id: Joi.number().required()
    });

    let User = new services.UserServices({ config, db });

    Joi.validate( req.body, schema )
      .then( params => {

        User.register(params)
          .then(response.json(res, 200))
          .catch(next);
      })
      .catch(next);

  }
}