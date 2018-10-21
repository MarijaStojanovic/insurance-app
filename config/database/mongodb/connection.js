const { name } = require('../../../package.json');
const environments = require('../../environments');

const PROJECT_NAME = name
  .toLowerCase()
  .trim()
  .replace(/[^A-Z0-9]+/ig, '_'); // Remove whitespace and symbols

/**
 * Return mongodb connection
 * @returns {String}
 */
module.exports.connectionString = () => {
  switch (environments.NODE_ENV) {
    case 'production':
      return `mongodb://localhost:27017/${PROJECT_NAME}_prod`;
    case 'test':
      return `mongodb://localhost:27017/${PROJECT_NAME}_test`;
    default:
      return `mongodb://localhost:27017/${PROJECT_NAME}_dev`;
  }
};
