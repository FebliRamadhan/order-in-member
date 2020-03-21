import Joi from 'joi';
import response from '../../lib/response';
import * as services from '../../services';

module.exports = ({ config, db }) => {

  return (req, res, next) => {

    const schema = Joi.object().keys({

      limit: Joi.number().integer().default(5),
      orderBy: Joi.string().valid('ASC', 'DESC'),
      status: Joi.string().valid('waiting', 'rejected', 'accepted')

    });

    let Orders = new services.OrderServices({ config, db });

    Joi.validate(req.query, schema)
      .then( params => {

        Orders.listOrders(params)
          .then(response.json(res, 200))
          .catch(next);

      })
      .catch(next)

  }

}