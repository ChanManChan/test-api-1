const express = require('express');
const router = express.Router();

// import controllers
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const { read, update } = require('../controllers/user');

// import validators
const { userUpdateValidator } = require('../validators/user');
const { runValidation } = require('../validators');

// Below route restricted only for authenticated users
// "requireSignin" will run and will make sure that the user has the valid token and only then it will run 'read' controller method and by the time it reach there (ie. read controller method), we will have req.user available as well
router.get('/user/:id', requireSignin, read);
// if they are signed in, we will have the user id already in the req.user thanks to requireSignin middleware
// private user will be updating their profile by hitting this endpoint
router.put(
  '/user/update',
  requireSignin,
  userUpdateValidator,
  runValidation,
  update
);

// restricted route only for admin role users
// admins will be updating their profile by hitting this endpoint
router.put(
  '/admin/update',
  requireSignin,
  adminMiddleware,
  userUpdateValidator,
  runValidation,
  update
);

module.exports = router;
