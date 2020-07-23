import request from 'supertest'
import { Types } from 'mongoose'
import { app } from '../../app'
import { Ticket, TicketDoc } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'
import { stan } from '../../nats-client'

  it (`returns an error if the ticket does not exist`, async () => {
    const ticketId = Types.ObjectId()
    await request(app)
      .post(`/api/orders`)
      .set(`Cookie`, global.signin())
      .send({ ticketId })
      .expect(404)
  })

  it (`returns an error if the ticket is already reserved`, async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 20
    })
    await ticket.save()
    const order = Order.build({
      ticket,
      userId: 'myUserId',
      status: OrderStatus.Created,
      expiresAt: new Date()
    })
    await order.save()
    await request(app)
      .post(`/api/orders`)
      .set(`Cookie`, global.signin())
      .send({ ticketId: ticket.id })
      .expect(400)
  })

describe(`success`, () => {
  let ticket: TicketDoc
  beforeEach(async () => {
    ticket = Ticket.build({
      title: 'concert',
      price: 20
    })
    await ticket.save()
  })
  it (`reserves a ticket`, async () => {
    await request(app)
      .post(`/api/orders`)
      .set(`Cookie`, global.signin())
      .send({ ticketId: ticket.id })
      .expect(201)
  })

  it  (`emits an order created event`, async () => {
    await request(app)
      .post(`/api/orders`)
      .set(`Cookie`, global.signin())
      .send({ ticketId: ticket.id })
      .expect(201)
    expect(stan.client.publish).toHaveBeenCalled()
  })
})
