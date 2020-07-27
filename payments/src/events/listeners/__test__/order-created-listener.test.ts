import { OrderCreatedListener } from '../order-created-listener'
import { OrderCreatedEvent, OrderStatus } from '@ke-tickets/common'
import { Order } from '../../../models/order'
import { Message } from 'node-nats-streaming'
import { stan } from '../../../nats-client'
import { Types } from 'mongoose'

let listener: OrderCreatedListener
let data: OrderCreatedEvent['data']
let msg: Message

beforeEach(async () => {
  listener = new OrderCreatedListener(stan.client)
  data = {
    userId: Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: {
      id: 'ticket-id',
      price: 10
    },
    version: 0,
    id: Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
  }

  //@ts-ignore
  msg = <Message>{
    ack: jest.fn()
  }
  await listener.onMessage(data, msg)
})

it (`creates an order with the given data`, async () => {
  const order = await Order.findById(data.id)
  expect(order!.price).toBe(data.ticket.price)
  expect(order!.userId).toBe(data.userId)
})

it (`acks the message`, async () => {
  expect(msg.ack).toHaveBeenCalled()
})
