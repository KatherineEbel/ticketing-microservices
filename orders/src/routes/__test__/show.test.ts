import request from 'supertest'
import { app } from '../../app'
import { Types } from 'mongoose'
import { Ticket } from '../../models/ticket'

it (`responds 401 if user is not logged in`, async () => {
  const id = Types.ObjectId().toString()
  await request(app)
    .get(`/api/orders/${id}`)
    .expect(401)
})

it (`responds 400 if invalid id given`, async () => {
  await request(app)
    .get(`/api/orders/122345`)
    .set(`Cookie`, global.signin())
    .expect(400)
})

it (`responds 404 if order doesn't exist`, async () => {
  const id = Types.ObjectId().toString()
  await request(app)
    .get(`/api/orders/${id}`)
    .set(`Cookie`, global.signin())
    .expect(404)
})

it (`responds 401 if user requests order that isn't theirs`, async () => {
  const ticket = Ticket.build({
    price: 20,
    title: 'concert'
  })
  await ticket.save()
  const { body: order } = await request(app)
    .post(`/api/orders`)
    .set(`Cookie`, global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)
  await request(app)
    .get(`/api/orders/${order.id.toString()}`)
    .set(`Cookie`, global.signin())
    .expect(401)
})

it (`responds with order for logged in user`, async () => {
  const ticket = Ticket.build({
    price: 20,
    title: 'concert'
  })
  await ticket.save()
  const user = global.signin ()
  const { body: order } = await request(app)
    .post(`/api/orders`)
    .set(`Cookie`, user)
    .send({ ticketId: ticket.id })
    .expect(201)
  await request(app)
    .get(`/api/orders/${order.id.toString()}`)
    .set(`Cookie`, user)
    .expect(200)
})
