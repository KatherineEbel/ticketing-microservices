import request from 'supertest'
import { app } from '../../app'
import { Ticket, TicketDoc } from '../../models/ticket'

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  })
  await ticket.save()
  return ticket
}
it (`fetches orders for logged in user`, async () => {
  // create and save three tickets
  const ticket1 = await buildTicket()
  const ticket2 = await buildTicket()
  const ticket3 = await buildTicket()

  // create one order as user 1
  const user1 = global.signin()
  await request(app)
    .post(`/api/orders`)
    .set(`Cookie`, user1)
    .send({ ticketId: ticket1.id })
  // create two orders as user 2
  const user2 = global.signin()
  const { body: order1 } = await request(app)
    .post(`/api/orders`)
    .set(`Cookie`, user2)
    .send({ ticketId: ticket2.id })

  const { body: order2 } = await request(app)
    .post(`/api/orders`)
    .set(`Cookie`, user2)
    .send({ ticketId: ticket3.id })
  // request orders for user 2
  const response = await request(app)
    .get(`/api/orders`)
    .set(`Cookie`, user2)
    .expect(200)
  // expect orders to not contain order for user 1

  expect(response.body).toHaveLength(2)
  expect(<TicketDoc>order1.id).toEqual(response.body[0].id)
  expect(<TicketDoc>order2.id).toEqual(response.body[1].id)
})
