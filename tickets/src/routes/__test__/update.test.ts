import request from 'supertest'
import { app } from '../../app'
import { Types } from 'mongoose'
import { stan } from '../../nats-client'

it(`returns 404 if ticket does not exist`, async () => {
  await request(app)
    .put(`/api/tickets/${Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send({
      title: 'New Title',
      price: 20,
    })
    .expect(404)
})

it(`returns 401 if user is not authenticated`, async () => {
  await request(app)
    .put(`/api/tickets/${Types.ObjectId().toHexString()}`)
    .send({
      title: 'New Title',
      price: 20,
    })
    .expect(401)
})

it(`returns 401 if ticket does not belong to logged in user`, async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: `ticket`,
      price: 20,
    })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: `updated ticket`,
      price: 30,
    })
    .expect(401)
})

it(`returns 400 if user provides an invalid title or price`, async () => {
  const cookie = global.signin()
  let response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: `ticket`,
      price: 20,
    })
    .expect(201)

  const ticketId = response.body.id
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: -10,
    })
    .expect(400)

  response = await request(app).get(`/api/tickets/${ticketId}`)
  expect(response.body.title).toEqual(`ticket`)
  expect(response.body.price).toEqual(20)
})

it(`updates ticket if user provides valid update`, async () => {
  const cookie = global.signin()
  let response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: `ticket`,
      price: 20,
    })
    .expect(201)

  const ticketId = response.body.id
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      title: `updated ticket`,
      price: 30,
    })
    .expect(200)

  response = await request(app).get(`/api/tickets/${ticketId}`)
  expect(response.body.title).toEqual(`updated ticket`)
  expect(response.body.price).toEqual(30)
})

it (`publishes an event`, async () => {
  const cookie = global.signin()
  let response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: `ticket`,
      price: 20,
    })
    .expect(201)
  expect(stan.client.publish).toHaveBeenCalled()
})
