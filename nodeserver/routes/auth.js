const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (router) => {
  router.post('/auth/register', (req, res) => {
    const user = new User(req.body);
    user.save()
      .then(doc => {
        res.sendStatus(200);
      })
      .catch(err => {
        console.error(err);
        if (err.code === 11000) {
          res.sendStatus(406);
        } else {
          res.sendStatus(500);
        }
      });
  });

  router.post('/auth/login', (req, res) => {
    User.findOne({email: req.body.email})
      .then(doc => {
        if (doc) {
          const valid = doc.authenticate(req.body.password);
          if (valid) {
            req.session.user = {
              username: doc.username,
              email: doc.email,
              _id: doc._id
            };
            res.sendStatus(200);
          } else {
            res.sendStatus(401);
          }
        } else {
          res.sendStatus(401);
        }
      })
      .catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
  });

  router.post('/auth/logout', (req, res) => {
    req.session.user = null;
    res.sendStatus(200);
  });

  router.post('/auth/current', (req, res) => {
    res.json(req.session.user);
  });
};
