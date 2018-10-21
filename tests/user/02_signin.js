const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const faker = require('faker');
const { addUser } = require('../helpers/userHelper');

describe('Sign in', () => {
  it('POST /signin Should successfully sign in user', (done) => {
    const body = {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.userName(),
    };
    addUser({ email: body.email, password: body.password })
      .then(() => {
        return request(app)
          .post('/api/v1/signin')
          .set('Accept', 'application/json')
          .send(body)
          .expect(200)
          .then(({ body: { message, results } }) => {
            message.should.equal('Successfully signed in');
            results.email.should.equal(body.email);
            should.not.exist(results.password);
            done();
          })
      })
      .catch(done);
  });

  it('POST /signin Should return missing parameters', (done) => {
    const body = {
      email: faker.internet.email(),
    };
    request(app)
      .post('/api/v1/signin')
      .set('Accept', 'application/json')
      .send(body)
      .expect(400)
      .then(({ body: { message } }) => {
        message.should.equal('Missing parameters');
        done();
      })
      .catch(done);
  });

  it('POST /signin Should return', (done) => {
    const body = {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.userName(),
    };
    addUser({ email: body.email, password: body.password })
      .then(() => {
        return request(app)
          .post('/api/v1/signin')
          .set('Accept', 'application/json')
          .send({ email: body.email, password: 'pass' })
          .expect(401)
          .then(({ body: { message } }) => {
            message.should.equal('Wrong credentials');
            done();
          })
      })
      .catch(done);
  });
});
