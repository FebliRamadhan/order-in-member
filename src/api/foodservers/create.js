import Joi from 'joi';
import response from '../../lib/response';
import * as services from '../../services';

module.exports = ({ config, db }) => {

  return (req, res, next) => {

    const bodySchema = Joi.object().keys({
      orders: Joi.array().items({
        order_id: Joi.number().integer()
      })
    });

    const paramSchema = Joi.object().keys({
      status: Joi.string().valid('rejected','accepted')
    })

    let Orders = new services.OrderServices({ config, db });

    Joi.validate(req.body, bodySchema)
      .then( body => {

        Joi.validate(req.params, paramSchema)
          .then(params => {             
            Orders.acceptOrder(params, body)
            .then(response.json(res, 200))
            .catch(next);
          })
          .catch(next);

      })
      .catch(next)

  }

}