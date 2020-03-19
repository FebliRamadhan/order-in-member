import Joi from 'joi';
import response from '../../lib/response';
import * as services from '../../services';

module.exports = ({ config, db }) => {

  return (req, res, next) => {

    const schema = Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required()
    });

    let Users = new services.UserServices({ config, db });

    Joi.validate(req.body, schema)
      .then( params => {

        Users.authentication(params)
          .then(response.json(res, 200))
          .catch(next);
      })
      .catch(next); 



  }
}