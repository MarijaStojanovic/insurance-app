const bunyan = require('bunyan');

const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Email validation
 * @param email
 * @returns {boolean}
 */
function validateEmail(email) {
  return emailRegExp.test(email);
}

/**
 * Error logger
 * @param error
 */
function logError(error) {
  const logger = bunyan.createLogger({
    name: error.name,
    streams: [
      {
        level: 'error',
        path: 'error.log',
      },
    ],
  });
  logger.error(error);
}

/**
 * Escapes the string, so it can be safely use in search, etc.
 * @param str
 * @returns {string}
 */
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

/**
 * Check if given id is valid ObjectId
 * @param id
 * @returns {boolean}
 */
function isValidId(id) {
  if (!id) {
    return false;
  }
  return !!id.toString().match(/^[0-9a-fA-F]{24}$/);
}

module.exports = {
  validateEmail,
  emailRegExp,
  logError,
  escapeRegExp,
  isValidId,
};
