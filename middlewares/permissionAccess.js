const { User } = require('./../models');
const { isValidId } = require('../lib/misc');
const error = require('../middlewares/errorHandling/errorConstants');

/**
 * Ensure that requested User has proper permissions
 * @param roles
 */

module.exports.permissionAccess = (...roles) => async (req, res, next) => {
  try {
    const ids = Object.values(req.params);

    if (!ids.every(id => isValidId(id))) {
      throw new Error('InvalidObjectId');
    }

    const userRoles = [];
    const { _id: loggedInUser } = req.user;

    const user = await User
      .findById(loggedInUser)
      .lean();

    if (!user) {
      throw new Error(error.NOT_FOUND);
    }

    if (roles.includes('Admin') && user.type === 'Admin') {
      userRoles.push('Admin');
    }

    // Check if User has any of the required roles
    const permissions = userRoles.some(role => roles.includes(role));
    if (!permissions) {
      throw new Error(error.FORBIDDEN);
    }

    req.user = user;

    return next();
  } catch (err) {
    return next(err);
  }
};

