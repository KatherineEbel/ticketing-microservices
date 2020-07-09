import request from 'supertest'
import { app } from '../../app'

it (`should remove cookie`, async function () {
  await request(app)
    .post(`/api/users/signup`)
    .send({
      email: `test@test.com`,
      password: `password`
    })
    .expect(201)

  let response = await request(app)
    .post(`/api/users/signout`)
    .expect(204)
  expect(response.get('Set-Cookie')[0].startsWith(`express:sess=;`)).toBeTruthy()
});
