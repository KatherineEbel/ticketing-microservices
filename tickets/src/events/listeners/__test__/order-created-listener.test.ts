import { Message } from 'node-nats-streaming'
import { OrderCreatedListener } from '../order-created-listener'
import { OrderCreatedEvent, OrderStatus } from '@ke-tickets/common'
import { stan } from '../../../nats-client'
import { Ticket, TicketDoc } from '../../../models/ticket'
import { Types } from 'mongoose'

let listener: OrderCreatedListener
let data: OrderCreatedEvent['data']
let ticket: TicketDoc
let msg: Message

beforeEach(async () => {
  listener = new OrderCreatedListener(stan.client)
  ticket = await Ticket.build({
    price: 10,
    title: 'my ticket',
    userId: Types.ObjectId().toHexString()
  }).save()

  data = {
    ticket: {
      price: ticket.price,
      id: ticket.id,
    },
    version: 0,
    userId: ticket.userId,
    expiresAt: `doesn't matter`,
    id: Types.ObjectId().toHexString(),
    status: OrderStatus.Created
  }

  // @ts-ignore
  msg = <Message>{
    ack: jest.fn()
  }

  await listener.onMessage(data, msg)
})

it (`sets the usedId of the ticket`, async () => {
  const updatedTicket = await Ticket.findById(data.ticket.id)
  expect(updatedTicket!.orderId).toBeDefined()
  expect(updatedTicket!.orderId).toEqual(data.id)
})

it (`acks the message`, async () => {
  expect(msg.ack).toHaveBeenCalled()
})

it (`publishes a ticket updated event`, async () => {
  expect(stan.client.publish).toHaveBeenCalled()
  expect((stan.client.publish as jest.Mock).mock.calls[0][0]).toEqual(`ticket:updated`)
  const { orderId } = JSON.parse((stan.client.publish as jest.Mock).mock.calls[0][1])
  expect(orderId).toEqual(data.id)
})
