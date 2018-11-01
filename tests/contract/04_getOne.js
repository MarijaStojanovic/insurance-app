/*  global describe, it */

require('chai').should();
const app = require('../../app');
const request = require('supertest');
const { addUser } = require('../helpers/userHelper');
const { addContract } = require('../helpers/contractHelper');

describe('Get one contract', () => {
  it('GET /contracts/:id Should return forbidden', (done) => {
    Promise.all([
      addUser(),
      addContract(),
    ])
      .then(([user, contract]) => request(app)
        .get(`/api/v1/contracts/${contract._id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(404)
        .then(({ body: { message } }) => {
          message.should.equal('Not Found');
          done();
        }))
      .catch(done);
  });

  it('GET /contracts/:id Should sucessfully return one contract', (done) => {
    addUser()
      .then((user) => {
        addContract({ createdBy: user.results._id })
          .then(contract => request(app)
            .get(`/api/v1/contracts/${contract._id}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${user.token}`)
            .expect(200)
            .then(({ body }) => {
              body.yearlyPrice.should.equal(contract.yearlyPrice);
              body.title.should.equal(contract.title);
              done();
            }));
      })
      .catch(done);
  });
});
