/*  global describe, it */
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

  it('POST /signup Should return an error if email does not valid', (done) => {
    const user = {
      email: faker.lorem.word(),
      password: faker.internet.password(),
    };
    request(app)
      .post('/api/v1/signup')
      .set('Accept', 'application/json')
      .send(user)
      .expect(400)
      .then(({ body: { message } }) => {
        message.should.equal('Please fill a valid email address');
        done();
      })
      .catch(done);
  });

  it('POST /signup Should successfully register user', (done) => {
    const user = {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
    };
    request(app)
      .post('/api/v1/signup')
      .set('Accept', 'application/json')
      .send(user)
      .expect(201)
      .then(({ body }) => {
        body.email.should.equal(body.email);
        should.not.exist(body.password);
        done();
      })
      .catch(done);
  });
});
