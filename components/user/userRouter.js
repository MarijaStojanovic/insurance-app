const express = require('express');
const UserController = require('./userController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');

const router = express.Router();

router
  .post('/signup', catchAsyncError(UserController.signUp))
  .post('/signin', catchAsyncError(UserController.signIn))
  .post('/change-password', catchAsyncError(UserController.changePassword));

module.exports = router;
