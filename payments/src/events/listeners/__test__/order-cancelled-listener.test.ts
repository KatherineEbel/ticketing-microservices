import { OrderCancelledEvent, OrderStatus } from '@ke-tickets/common'
import { Order, OrderDoc } from '../../../models/order'
import { stan } from '../../../nats-client'
import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderCancelledListener } from '../order-cancelled-listener'

let listener: OrderCancelledListener
let data: OrderCancelledEvent['data']
let orderId: string
let msg: Message

beforeEach(async () => {
  listener = new OrderCancelledListener(stan.client)
  const order = await Order.build({
    userId: Types.ObjectId().toHexString(),
    price: 10,
    status: OrderStatus.Created,
    version: 0,
  }).save()

  orderId = order!.id
  data = { orderId, version: 1, ticketId: '' }

  // @ts-ignore
  msg = <Message>{
    ack: jest.fn()
  }
  await listener.onMessage(data, msg)
})

it (`changes the status of the order to cancelled`, async () => {
  const order = await Order.findById(orderId)
  expect(order!.status).toBe(OrderStatus.Cancelled)
})

it (`acks the message`, async () => {
  expect(msg.ack).toHaveBeenCalled()
})
