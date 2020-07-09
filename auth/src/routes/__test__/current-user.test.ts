import request from 'supertest'
import { app } from '../../app'

it (`responds with details about the current user`, async function () {
  const cookie = await global.signup()
  const response = await request(app)
    .get(`/api/users/currentuser`)
    .set('Cookie', cookie)
    .expect(200)
  expect(response.body.currentUser.email).toEqual('test@test.com')
});

it (`responds with null current user if not authenticated`, async function () {
  const response = await request(app)
    .get(`/api/users/currentuser`)
    .expect(200)
  expect(response.body.currentUser).toBeNull()
});
