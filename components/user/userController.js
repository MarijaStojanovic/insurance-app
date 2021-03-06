const { User } = require('../../models');
const { issueNewToken } = require('../../lib/jwtHandler');
const bcrypt = require('bcrypt');
const { validateEmail } = require('./../../lib/misc');
const error = require('../../middlewares/errorHandling/errorConstants');

/**
 * @api {post} /signup Register User
 * @apiVersion 1.0.0
 * @apiName Signup
 * @apiDescription Register new User
 * @apiGroup User
 *
 * @apiParam (body) {String} email Email
 * @apiParam (body) {String} password Password
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
  {
    "role": "User",
    "_id": "5bdc2d9406bd261c7f2caf3e",
    "email": "user@mailinator.com",
    "createdAt": "2018-11-02T10:57:24.927Z",
    "updatedAt": "2018-11-02T10:57:24.927Z",
    "__v": 0,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmRjMmQ5NDA2YmQyNjFjN2YyY2FmM2UiLCJpYXQiOjE1NDExNTYyNDUsImV4cCI6MTU0MTE5OTQ0NX0.IHodxVNrui7vlLCY3myUlglI0Y1NI_7Qmn7Sr1i-U-A"
  }
 * @apiUse MissingParamsError
 * @apiUse ValidEmailError
 * @apiUse DuplicateEmailError
 */
module.exports.signUp = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error(error.MISSING_PARAMETERS);
  }

  if (!validateEmail(email)) {
    throw new Error(error.INVALID_EMAIL);
  }

  const existUser = await User
    .findOne({ email: email.toLowerCase() })
    .lean();

  if (existUser) {
    throw new Error(error.DUPLICATE_EMAIL);
  }

  const newUser = await new User({ email, password }).save();
  const user = newUser.toObject();

  user.token = issueNewToken({
    _id: user._id,
  });

  delete user.password;

  return res.status(201).send(user);
};

/**
 * @api {post} /signin Sign in
 * @apiVersion 1.0.0
 * @apiName Sign in
 * @apiDescription Log in User
 * @apiGroup User
 *
 * @apiParam (body) {String} email User email
 * @apiParam (body) {String} password User password
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
  {
    "_id": "5bdc2d9406bd261c7f2caf3e",
    "role": "User",
    "email": "user@mailinator.com",
    "createdAt": "2018-11-02T10:57:24.927Z",
    "updatedAt": "2018-11-02T10:57:24.927Z",
    "__v": 0,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmRjMmQ5NDA2YmQyNjFjN2YyY2FmM2UiLCJpYXQiOjE1NDExNTYzODgsImV4cCI6MTU0MTE5OTU4OH0.tFtqlYzmeympy1mSV0s1YORTDpeJ60j68MQvMwVnEVg"
  }
 * @apiUse MissingParamsError
 * @apiUse NotFound
 * @apiUse CredentialsError
 */
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error(error.MISSING_PARAMETERS);
  }

  const user = await User
    .findOne({ email: email.toLowerCase() })
    .select('+password')
    .lean();

  if (!user) {
    throw new Error(error.NOT_FOUND);
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new Error(error.CREDENTIALS_ERROR);
  }

  delete user.password;

  user.token = issueNewToken({
    _id: user._id,
  });

  return res.status(200).send(user);
};

/**
 * @api {post} /change-password Change password
 * @apiVersion 1.0.0
 * @apiName changePassword
 * @apiDescription Changing password for logged in user
 * @apiGroup User
 *
 * @apiParam {String} oldPassword User's old password
 * @apiParam {String} newPassword User's new password to set to
 *
 * @apiSuccessExample Success-Response:
 HTTP/1.1 204 OK

 * @apiUse MissingParamsError
 * @apiUse CredentialsError
 */
module.exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { _id } = req.user;

  if (!oldPassword || !newPassword) {
    throw new Error(error.MISSING_PARAMETERS);
  }

  const user = await User
    .findOne(
      { _id },
      { password: 1 })
    .lean();

  if (!bcrypt.compareSync(oldPassword, user.password)) {
    throw new Error(error.CREDENTIALS_ERROR);
  }

  const password = bcrypt.hashSync(newPassword, 10);
  await User
    .updateOne(
      { _id },
      { $set: { password } });

  return res.status(204).send();
};
