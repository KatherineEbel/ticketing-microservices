import request from 'supertest'
import { app } from '../../app'
import { Types } from 'mongoose'

it(`returns 404 if ticket not found`, async () => {
  await request(app)
    .get(`/api/tickets/${Types.ObjectId().toHexString()}`)
    .send()
    .expect(404)
})

it(`returns the ticket if ticket is found`, async () => {
  const ticket = {
    title: 'concert',
    price: 30,
  }
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send(ticket)
    .expect(201)
  const tixResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)
  expect(tixResponse.body.title).toEqual(ticket.title)
  expect(tixResponse.body.price).toEqual(ticket.price)
})
