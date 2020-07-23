import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { OrderDoc, OrderStatus } from '../../models/order'
import { Types } from 'mongoose'
import { stan } from '../../nats-client'

let ticket, order: OrderDoc, user: string[]

beforeEach(async () => {
  user = global.signin()
  ticket = Ticket.build({
    title: 'concert',
    price: 20
  })
  await ticket.save()
  const { body: userOrder } = await request(app).post(`/api/orders`)
    .set(`Cookie`, user)
    .send({ ticketId: ticket.id })
    .expect(201)
  order = userOrder
})

it (`responds with 400 if order id not valid`, async () => {
  await request(app)
    .patch(`/api/orders/12345`)
    .set(`Cookie`, user)
    .expect(400)
})

it (`responds with 401 if user is not logged in`, async () => {
  await request(app)
    .patch(`/api/orders/${order.id.toString()}`)
    .expect(401)
})

it (`responds with not found if ticket does not exist`, async () => {
  const id = Types.ObjectId().toString()
  await request(app)
    .patch(`/api/orders/${id}`)
    .set(`Cookie`, user)
    .expect(404)
})

it (`responds with 401 if order does not belong to logged in user`, async () => {
  await request(app)
    .patch(`/api/orders/${order.id.toString()}`)
    .set(`Cookie`, global.signin())
    .expect(401)
})

it (`sets order status to Cancelled`, async () => {
  await request(app)
    .patch(`/api/orders/${order.id.toString()}`)
    .set(`Cookie`, user)
    .expect(204)
  const { body: updatedOrder } = await request(app).get(`/api/orders/${order.id.toString()}`)
    .set(`Cookie`, user)
    .expect(200)
  expect(updatedOrder.status).toEqual(OrderStatus.Cancelled)
})

it (`should emit an order updated event`, async () => {
  await request(app)
    .patch(`/api/orders/${order.id.toString()}`)
    .set(`Cookie`, user)
    .expect(204)

  expect(stan.client.publish).toHaveBeenCalled()
})
