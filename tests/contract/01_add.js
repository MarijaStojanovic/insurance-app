/*  global describe, it */
require('chai').should();
const app = require('../../app');
const request = require('supertest');
const faker = require('faker');
const { addUser } = require('../helpers/userHelper');

describe('Add contract', () => {
  it('POST /contracts Should return missing parameters', (done) => {
    addUser({
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
    })
      .then((user) => {
        return request(app)
          .post('/api/v1/contracts')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${user.token}`)
          .send({})
          .expect(400)
          .then(({ body: { message } }) => {
            message.should.equal('Missing parameters');
            done();
          });
      })
      .catch(done);
  });

  it('POST /contracts Should successfully add new contract', (done) => {
    addUser({
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
    })
      .then((user) => {
        const body = {
          title: faker.internet.email().toLowerCase(),
          companyName: faker.lorem.word(),
          yearlyPrice: faker.random.number(),
        };
        return request(app)
          .post('/api/v1/contracts')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${user.token}`)
          .send(body)
          .expect(201)
          .then(({ body: result }) => {
            result.title.should.equal(result.title);
            result.companyName.should.equal(body.companyName);
            result.yearlyPrice.should.equal(body.yearlyPrice);
            result.cancelled.should.equal(false);
            done();
          });
      })
      .catch(done);
  });
});
