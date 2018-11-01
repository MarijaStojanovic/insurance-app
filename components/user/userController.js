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
    "_id": "5bcc565c915d5d15e6378db3",
    "email": "testuser@mailinator.com",
    "createdAt": "2018-10-21T10:35:08.081Z",
    "updatedAt": "2018-10-21T10:35:08.081Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmNjNTY1YzkxNWQ1ZDE1ZTYzNzhkYjMiLCJpYXQiOjE1NDAxMTgxMDgsImV4cCI6MTU0MDE2MTMwOH0.b-FZtkhEnDCkyOVl_dO9qHSsDjAj_sb1nK8T8EZOxBU",
    "__v": 0
  }
 * @apiUse MissingParamsError
 */
module.exports.signUp = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error(error.MISSING_PARAMETERS);
  }

  if (!validateEmail(email)) {
    throw new Error(error.INVALID_EMAIL);
  }

  const user = await new User({ email, password }).save();
  user.password = undefined;

  user.token = issueNewToken({
    _id: user._id,
  });

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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmNjNTY1YzkxNWQ1ZDE1ZTYzNzhkYjMiLCJpYXQiOjE1NDAxMTgxNDQsImV4cCI6MTU0MDE2MTM0NH0.6D2TGeH6K8I0HeGkbw8v4q7xDWrhU1b3aNvEMW6knvI",
    "_id": "5bcc565c915d5d15e6378db3",
    "role": "User",
    "email": "testuser@mailinator.com",
    "createdAt": "2018-10-21T10:35:08.081Z",
    "updatedAt": "2018-10-21T10:35:08.081Z",
    "__v": 0
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
 {}
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
