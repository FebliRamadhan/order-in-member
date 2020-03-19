import fs from 'fs';
import jwt from 'jsonwebtoken';

module.exports = async (req, res, next) => {

  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) return res.status(401).json({ name: 'TokenNotFound', message: ' Token Not Found'});

  if (token && token.startsWith('Bearer')) {
    
    token = token.slice(7, token.length);

    jwt.verify(token, fs.readFileSync('public'), {algorithms: 'RS256'}, (error, decoded) => {

      if (error) next(error);

      req.user = decoded;
      next();

    });

  }

}