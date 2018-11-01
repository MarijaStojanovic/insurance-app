const bunyan = require('bunyan');
const validator = require('validator');

const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/**
 * Email validation
 * @param email
 * @returns {boolean}
 */
const validateEmail = email => validator.isEmail(email);

/**
 * Error logger
 * @param error
 */
const logError = (error) => {
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
};

/**
 * Check if given id is valid ObjectId
 * @param id
 * @returns {boolean}
 */
const isValidId = id => validator.isMongoId(id);


module.exports = {
  validateEmail,
  emailRegExp,
  logError,
  isValidId,
};
