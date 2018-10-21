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


/**
 * @param {Number} numberOfContracts Number of contracts needed
 * @returns {Promise} returns an array of contracts
 */

function addManyContracts(
  {
    numberOfContracts = faker.random.number({ min: 10, max: 20 }),
    createdBy = new Object(),
  } = {}) {
  const data = [];
  for (let i = 0; i < numberOfContracts; i += 1) {
    data.push({
      title: faker.lorem.words(),
      companyName: faker.lorem.word(),
      yearlyPrice: faker.random.number(),
      createdBy,
    });
  }
  return Contract.insertMany(data);
}

module.exports = {
  addContract,
  addManyContracts,
};
