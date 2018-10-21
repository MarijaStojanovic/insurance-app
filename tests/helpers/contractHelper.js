const { Contract } = require('../../models');
const faker = require('faker');
const { Types: { ObjectId } } = require('mongoose');


/**
 * @param {String} title Contract title
 * @param {String} companyName Contract companyName
 * @param {String} yearlyPrice Contract yearlyPrice
 * @returns {Promise} returns new Contract
 */

async function addContract(
  {
    title = faker.internet.userName(),
    companyName = faker.lorem.word(),
    yearlyPrice = faker.random.number(),
    createdBy = new ObjectId(),
  } = {}) {
  const contract = await new Contract({
    title,
    companyName,
    yearlyPrice,
    createdBy,
  }).save();

  return contract;
}

module.exports = {
  addContract,
};
