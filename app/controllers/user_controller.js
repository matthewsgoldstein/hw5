import jwt from 'jwt-simple';
import config from '../config';
import User from '../models/user_model';


export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send('You must provide email and password');
  }

  // 🚀 TODO:
  // here you should do a mongo query to find if a user already exists with this email.
  // if user exists then return an error. If not, use the User model to create a new user.

  User.find()
  .then(result => {
    if (result == null) {
      const user = new User();
      user.username = req.body.username;
      user.email = req.body.email;
      user.password = req.body.password;
      user.save();
      res.json({ message: 'User created!' });
    } else {
      res.json({ message: 'User was already there!' });
    }
  })
  .catch(error => {
    res.json({ error });
  });

  // and then return a token same as you did in in signin
  res.send({ token: tokenForUser(req.user) });
};

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}
