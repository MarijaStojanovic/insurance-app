const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const { addUser } = require('../helpers/userHelper');
const { addContract, addManyContracts } = require('../helpers/contractHelper');
const { Contract } = require('../../models');

describe('Cancel contract', () => {
  it('PATCH /contracts/:id Should return forbidden', (done) => {
    Promise.all([
      addUser(),
      addContract(),
    ])
      .then(([user, contract]) => {
        return request(app)
          .patch(`/api/v1/contracts/${contract._id}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${user.token}`)
          .expect(403)
          .then(({ body: { message } }) => {
            message.should.equal('Insufficient privileges');
            done();
          });
      })
      .catch(done);
  });

  it('PATCH /contracts/:id Should sucessfully cancelled contract as a User', (done) => {
    addUser()
      .then((user) => {
        addManyContracts({ createdBy: user.results._id })
          .then(([contract]) => {
            return request(app)
              .patch(`/api/v1/contracts/${contract._id}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${user.token}`)
              .expect(200)
              .then(({ body: { message } }) => {
                message.should.equal('Contract successfully cancelled');
                return Contract.findById({ _id: contract._id })
                  .then((updatedContract) => {
                    updatedContract.cancelled.should.equal(true);
                    updatedContract.createdBy.toString().should.equal(user.results._id.toString());
                    done();
                  });
              });
          });
      })
      .catch(done);
  });
});
