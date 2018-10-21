const express = require('express');
const UserController = require('./userController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');
const { permissionAccess } = require('../../middlewares/permissionAccess');

const router = express.Router();

router
  .post('/signup', catchAsyncError(UserController.signUp))
  .post('/signin', catchAsyncError(UserController.signIn));

module.exports = router;
