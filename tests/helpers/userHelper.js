const { User } = require('../../models');
const faker = require('faker');
const { issueNewToken } = require('../../lib/jwtHandler');

/**
 * @param {String} email User email
 * @param {String} password User password
 * @returns {Promise} returns new User
 */

const addUser = async (
  {
    email = faker.internet.email(),
    password = 'testpassword',
  } = {}) => {
  const user = await new User({
    email,
    password,
  }).save();

  user.password = undefined;

  return {
    message: 'Successfully added user',
    token: issueNewToken({
      _id: user._id,
    }),
    results: user,
  };
};

module.exports = {
  addUser,
};
