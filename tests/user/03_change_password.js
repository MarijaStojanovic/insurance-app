const app = require('../../app');
const request = require('supertest');
const should = require('chai').should();
const faker = require('faker');
const { addUser } = require('../helpers/userHelper');

describe('Change password', () => {
  it('POST /change-password Should successfully change password', (done) => {
    addUser()
      .then((user) => {
        const body = {
          oldPassword: 'testpassword',
          newPassword: faker.internet.password(),
        };
        return request(app)
          .post('/api/v1/change-password')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${user.token}`)
          .send(body)
          .expect(200)
          .then(({ body: { message } }) => {
            message.should.equal('Password successfully updated');
            // If password is successfully changed user should successfully sign in
            const bodySignin = {
              email: user.results.email,
              password: body.newPassword,
            };
            return request(app)
              .post('/api/v1/signin')
              .set('Accept', 'application/json')
              .send(bodySignin)
              .expect(200)
              .then((res) => {
                res.body.message.should.equal('Successfully signed in');
                res.body.results.email.should.equal(user.results.email);
                should.not.exist(res.body.results.password);
                done();
              });
          });
      })
      .catch(done);
  });

  it('POST /change-password Should return credentials error (If old password is not the same as current user password)', (done) => {
    addUser()
      .then(({ token }) => {
        const body = {
          oldPassword: faker.internet.password(),
          newPassword: faker.internet.password(),
        };
        return request(app)
          .post('/api/v1/change-password')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(body)
          .expect(401)
          .then(({ body: { errorCode } }) => {
            errorCode.should.equal(8);
            done();
          });
      })
      .catch(done);
  });
});
