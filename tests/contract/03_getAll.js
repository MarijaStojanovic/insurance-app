/*  global describe, it,beforeEach */
require('chai').should();
const app = require('../../app');
const request = require('supertest');
const mongoose = require('mongoose');
const { addUser } = require('../helpers/userHelper');
const { addManyContracts } = require('../helpers/contractHelper');

describe('Get all contracts', () => {
  beforeEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
  it('GET /contracts/ Should sucessfully returns all contracts', (done) => {
    addUser()
      .then(user => addManyContracts({ createdBy: user.results._id })
        .then(contracts => request(app)
          .get('/api/v1/contracts')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${user.token}`)
          .expect(200)
          .then(({ body: { count } }) => {
            count.should.equal(contracts.length);
            done();
          })))
      .catch(done);
  });

  it('GET /contracts/ Should sucessfully returns 10 contracts', (done) => {
    addUser()
      .then(user => addManyContracts({ createdBy: user.results._id })
        .then(contracts => request(app)
          .get('/api/v1/contracts?limit=10')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${user.token}`)
          .expect(200)
          .then(({ body: { contracts: result, count } }) => {
            result.length.should.equal(10);
            count.should.equal(contracts.length);
            done();
          })))
      .catch(done);
  });

  it('GET /contracts/ Should return InvalidValue error', (done) => {
    addUser()
      .then(user => addManyContracts({ createdBy: user.results._id })
        .then(() => request(app)
          .get('/api/v1/contracts?limit=aa')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${user.token}`)
          .expect(400)
          .then(({ body: { message } }) => {
            message.should.equal('Value is not valid');
            done();
          })))
      .catch(done);
  });
});
