import Joi from 'joi';
import response from '../../lib/response';
import * as services from '../../services';

module.exports = ({ config, db }) => {

  return (req, res, next) => {

    const schema = Joi.object().keys({

      orders: Joi.array().items({
        order_name: Joi.string().required(),
        quantity: Joi.number().positive()
      })
      
    });

    let Orders = new services.OrderServices({ actor: req.user, config, db });
    
    Joi.validate(req.body, schema)
      .then( params => {

        Orders.create(params)
          .then(response.json(res, 200))
          .catch(next);

      })
      .catch(next);

  }

}