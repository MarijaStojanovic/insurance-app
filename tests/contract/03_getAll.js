const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const { addUser } = require('../helpers/userHelper');
const { addManyContracts } = require('../helpers/contractHelper');

describe('Get all contracts', () => {
  it('GET /contracts/ Should sucessfully update contract as a User', (done) => {
    addUser()
      .then((user) => {
        addManyContracts({ createdBy: user.results._id })
          .then((contracts) => {
            return request(app)
              .get('/api/v1/contracts')
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${user.token}`)
              .expect(200)
              .then(({ body: { message, results } }) => {
                message.should.equal('List of all contracts');
                results.length.should.equal(contracts.length);
                done();
              });
          });
      })
      .catch(done);
  });
});
