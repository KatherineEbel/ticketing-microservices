import request from 'supertest'
import { app } from '../../app'

it(`returns all tickets`, async () => {
  await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'Ticket 1',
      price: 20
    })
    .expect(201)
  const response = await request(app)
    .get(`/api/tickets`)
    .expect(200)
  const tickets = response.body
  expect(tickets.length).toEqual(1)
})
