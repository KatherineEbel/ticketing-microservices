import { OrderCancelledListener } from '../order-cancelled-listener'
import { OrderCancelledEvent } from '@ke-tickets/common'
import { stan } from '../../../nats-client'
import { Ticket, TicketDoc } from '../../../models/ticket'
import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'

let listener: OrderCancelledListener
let data: OrderCancelledEvent['data']
let msg: Message
let orderId = Types.ObjectId().toHexString()
let ticket: TicketDoc

beforeEach(async () => {
  listener = new OrderCancelledListener(stan.client)
  ticket = await Ticket
    .build({
    userId: Types.ObjectId().toHexString(),
    title: 'my ticket',
    price: 10,
  })
    .set({ orderId })
    .save()

  data = {
    version: ticket.version,
    ticketId: ticket.id,
    orderId: orderId
  }

  // @ts-ignore
  msg = <Message>{
    ack: jest.fn()
  }

  await listener.onMessage(data, msg)
})

it (`updates the ticket, and publishes an event`, async () => {
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).not.toBeDefined()
  expect(stan.client.publish).toHaveBeenCalled()
  expect((stan.client.publish as jest.Mock).mock.calls[0][0]).toBe(`ticket:updated`)
})

it (`acks the message`, async () => {
  expect(msg.ack).toHaveBeenCalled()
})
