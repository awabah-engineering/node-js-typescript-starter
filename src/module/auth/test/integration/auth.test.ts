import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import * as authUrl from '../../urls/auth.url';
import setupTestDB from '../../../../utils/setup-db';
import TestUtils from '../../../../utils/constants';
import app from '../../../../bin/app';

setupTestDB();
describe('Auth', () => {
  const newUserData = TestUtils.createNewUser();
  const verifiedUserData = TestUtils.createNewUser();
  let userEmail = '';
  let userPassword = '';
  let verifiedUserEmail = '';
  let verifiedUserPassword = '';
  /**
   * new user
   */
  beforeAll(async () => {
    request(app)
      .post(`${authUrl.REGISTER_URL}`)
      .send(newUserData)
      .end((err, result) => {
        userEmail = result.body.data.email;
        userPassword = newUserData.password;
      });
  });
  /**
   * create verified user
   */
  beforeAll((done) => {
    request(app)
      .post(`${authUrl.REGISTER_URL}`)
      .send(verifiedUserData)
      .end((err, result) => {
        verifiedUserEmail = result.body.data.email;
        verifiedUserPassword = verifiedUserData.password;
        done();
      });
  });

  /**
   * log user in tot get token
   */
  beforeAll(async () => {
    const res = await request(app)
      .post(`${authUrl.LOGIN_URL}`)
      .send({ email: verifiedUserEmail, password: verifiedUserPassword });
    expect(res.body.status).toEqual(true);
    token = res.body.data.token;
  });

  describe('/auth', () => {
    it('/login should NOT login a user that does not exist', (done) => {
      const randomUser = TestUtils.createNewUser();
      request(app)
        .post(`${authUrl.LOGIN_URL}`)
        .send(randomUser)
        .end((err, res) => {
          expect(res.status).toEqual(StatusCodes.NOT_FOUND);
          expect(res.body.message).toEqual('User does not exist');
          expect(res.body.status).toEqual(false);
          done();
        });
    });
    it('should login a user and return token', (done) => {
      request(app)
        .post(`${authUrl.LOGIN_URL}`)
        .send({ email: verifiedUserEmail, password: verifiedUserPassword })
        .end((err, res) => {
          expect(res.body.message).toEqual('Log in successful');
          expect(res.body.status).toEqual(true);
          expect(res.body.data).toHaveProperty('token');
          done();
        });
    });
    it('should create a user', async () => {
      const user = TestUtils.createNewUser();
      const res = await request(app).post(`${authUrl.REGISTER_URL}`).send(user);
      expect(res.status).toEqual(StatusCodes.CREATED);
      expect(res.body.message).toEqual('User Created');
      expect(res.body.status).toEqual(true);
      expect(res.body).toHaveProperty('data');
    });
    it('should not create a user that already exists', async () => {
      const result = await request(app).post(`${authUrl.REGISTER_URL}`).send({
        email: userEmail,
        password: userPassword,
      });
      expect(result.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(result.body.status).toEqual(false);
    });
  });
});
