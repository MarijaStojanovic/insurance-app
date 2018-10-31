/*  global describe, it */
require('chai').should();

const app = require('../../app');
const request = require('supertest');
const faker = require('faker');
const { addUser } = require('../helpers/userHelper');
const { addContract } = require('../helpers/contractHelper');
const { Contract } = require('../../models');

describe('Edit contract', () => {
  it('PUT /contracts/:id Should return forbidden', (done) => {
    Promise.all([
      addUser(),
      addContract(),
    ])
      .then(([user, contract]) => {
        const body = {
          title: faker.lorem.word(),
        };
        return request(app)
          .put(`/api/v1/contracts/${contract._id}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${user.token}`)
          .send(body)
          .expect(403)
          .then(({ body: { message } }) => {
            message.should.equal('Insufficient privileges');
            done();
          });
      })
      .catch(done);
  });

  it('PUT /contracts/:id Should sucessfully update contract as a User', (done) => {
    addUser()
      .then((user) => {
        addContract({ createdBy: user.results._id })
          .then((contract) => {
            const body = {
              title: faker.lorem.word(),
            };
            return request(app)
              .put(`/api/v1/contracts/${contract._id}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${user.token}`)
              .send(body)
              .expect(200)
              .then(({ body: { message, results } }) => {
                message.should.equal('Contract successfully updated');
                results.title.should.equal(body.title);
                return Contract.findById({ _id: results._id })
                  .then((updatedContract) => {
                    updatedContract.title.should.equal(body.title);
                    updatedContract.companyName.should.equal(contract.companyName);
                    updatedContract.yearlyPrice.should.equal(contract.yearlyPrice);
                    updatedContract.cancelled.should.equal(false);
                    updatedContract.createdBy.toString().should.equal(user.results._id.toString());
                    done();
                  });
              });
          });
      })
      .catch(done);
  });
});
