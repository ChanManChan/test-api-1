const User = require('../models/user');

// include a and b, exclude other fields
// query.select('a b');

// exclude c and d, include other fields
// query.select('-c -d');

exports.read = (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .select('-hashed_password -salt')
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: 'User not found'
        });
      }
      // user.hashed_password=undefined
      // user.salt = undefined
      res.json(user);
    });
};

// the middleware(requireSignin) in auth.js file set the req.user (if a valid token is present)
// req.user = { _id: '5e6376404b6a0b0d6bb63638', iat: 1583853973, exp: 1584458773 } <-- thanks to the requireSignin middleware
exports.update = (req, res) => {
  // i'm are not allowing users to update their email and role (only name and password)
  const { name, password } = req.body;
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }
    user.name = name;
    user.password = password;
    user.save((err, updatedUser) => {
      if (err) {
        return res.status(500).json({
          error: 'User update failed'
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};
