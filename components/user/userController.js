const { User } = require('../../models');
const { issueNewToken } = require('../../lib/jwtHandler');
const bcrypt = require('bcrypt');
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
    "message": "Successfully signed up",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmNjNTY1YzkxNWQ1ZDE1ZTYzNzhkYjMiLCJpYXQiOjE1NDAxMTgxMDgsImV4cCI6MTU0MDE2MTMwOH0.b-FZtkhEnDCkyOVl_dO9qHSsDjAj_sb1nK8T8EZOxBU",
    "results": {
      "role": "User",
      "_id": "5bcc565c915d5d15e6378db3",
      "email": "testuser@mailinator.com",
      "createdAt": "2018-10-21T10:35:08.081Z",
      "updatedAt": "2018-10-21T10:35:08.081Z",
      "__v": 0
    }
  }
 * @apiUse MissingParamsError
 */
module.exports.signUp = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error(error.MISSING_PARAMETERS);
  }

  const user = await new User({ email, password }).save();
  user.password = undefined;

  return res.status(201).send({
    message: 'Successfully signed up',
    token: issueNewToken({
      _id: user._id,
    }),
    results: user,
  });
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
    "message": "Successfully signed in",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmNjNTY1YzkxNWQ1ZDE1ZTYzNzhkYjMiLCJpYXQiOjE1NDAxMTgxNDQsImV4cCI6MTU0MDE2MTM0NH0.6D2TGeH6K8I0HeGkbw8v4q7xDWrhU1b3aNvEMW6knvI",
    "results": {
      "_id": "5bcc565c915d5d15e6378db3",
      "role": "User",
      "email": "testuser@mailinator.com",
      "createdAt": "2018-10-21T10:35:08.081Z",
      "updatedAt": "2018-10-21T10:35:08.081Z",
      "__v": 0
    }
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

  return res.status(200).send({
    message: 'Successfully signed in',
    token: issueNewToken({
      _id: user._id,
    }),
    results: user,
  });
};
