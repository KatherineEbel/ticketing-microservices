import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

import { stan } from '../../nats-client'

it (`has a route handler listening to /api/tickets for post requests`, async function () {
  let response = await request(app)
    .post(`/api/tickets`)
    .send({})
  expect(response.status).not.toEqual(404)
})

it (`can only be accessed for authenticated user`, async function () {
  await request(app)
    .post(`/api/tickets`)
    .send({})
    .expect(401)
})

it ('does not return 401 if user is signed in', async function () {
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({})
  expect(response.status).not.toEqual(401)
});

it (`returns an error if an invalid title is provided`, async function () {
  await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400)

  await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400)
})

it (`returns an error if an invalid price is provided`, async function () {
  await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'Test Title',
      price: -10,
    })
    .expect(400)

  await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'Test Title',
    })
    .expect(400)

})

it(`creates a ticket with valid inputs`, async function () {
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)
  await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'Test Title',
      price: 20,
    })
    .expect(201)
  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(tickets[0].title).toEqual('Test Title')
  expect(tickets[0].price).toEqual(20)
})

it (`publishes an event`, async () => {
  await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'Test Title',
      price: 10,
    })
    .expect(201)
  expect(stan.client.publish).toHaveBeenCalled()
})
