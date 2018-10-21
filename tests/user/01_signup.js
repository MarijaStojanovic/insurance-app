const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const faker = require('faker');

describe('Signup', () => {
  it('POST /signup Should return missing parameters', (done) => {
    request(app)
      .post('/api/v1/signup')
      .set('Accept', 'application/json')
      .send({})
      .expect(400)
      .then(({ body: { message } }) => {
        message.should.equal('Missing parameters');
        done();
      })
      .catch(done);
  });

  it('POST /signup Should successfully register user', (done) => {
    const body = {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
    };
    request(app)
      .post('/api/v1/signup')
      .set('Accept', 'application/json')
      .send(body)
      .expect(201)
      .then(({ body: { message, results } }) => {
        message.should.equal('Successfully signed up');
        results.email.should.equal(body.email);
        should.not.exist(results.password);
        done();
      })
      .catch(done);
  });
});
