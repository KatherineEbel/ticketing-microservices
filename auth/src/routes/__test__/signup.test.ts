import request from 'supertest'
import { app } from '../../app'

it (`returns a 201 on successful signup`,  async function() {
  return request(app)
    .post(`/api/users/signup`)
    .send({
      email: `test@test.com`,
      password: `password`,
    })
    .expect(201)
});

it (`returns a 400 with invalid email`,  async function() {
  return request(app)
    .post(`/api/users/signup`)
    .send({
      email: `badEmail`,
      password: `password`,
    })
    .expect(400)
});

it (`returns a 400 with invalid password`,  async function() {
  return request(app)
    .post(`/api/users/signup`)
    .send({
      email: `test@test.com`,
      password: ``,
    })
    .expect(400)
});

it (`returns a 400 with missing email and password`,  async function() {
  return request(app)
    .post(`/api/users/signup`)
    .send({
    })
    .expect(400)
});

it (`disallows duplicate emails`, async function() {
  await request(app)
    .post(`/api/users/signup`)
    .send({
      email: `test@test.com`,
      password: `password`,
    })
    .expect(201)

  await request(app)
    .post(`/api/users/signup`)
    .send({
      email: `test@test.com`,
      password: `password`,
    })
    .expect(400)
});

it (`sets a cookie after successful signup`, async function () {
  const response = await request(app)
    .post(`/api/users/signup`)
    .send({
      email: `test@test.com`,
      password: `password`,
    })
    .expect(201)
  expect(response.get('Set-Cookie')).toBeDefined()
});
