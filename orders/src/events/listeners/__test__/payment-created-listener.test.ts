import { PaymentCreatedListener } from '../payment-created-listener'
import { OrderStatus, PaymentData } from '@ke-tickets/common'
import { Message } from 'node-nats-streaming'
import { stan } from '../../../nats-client'
import { Order } from '../../../models/order'
import { Types } from 'mongoose'
import { Ticket } from '../../../models/ticket'

let listener: PaymentCreatedListener
let data: PaymentData
let msg: Message

beforeEach(async () => {
  listener = new PaymentCreatedListener(stan.client)
  // @ts-ignore
  msg = <Message>{
    ack: jest.fn()
  }
  const ticket = await Ticket.build({
    price: 10,
    title: `ticket`,
  }).save()
  const order = await Order.build({
    userId: Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket,
    expiresAt: new Date()
  }).save()

  data = {
    stripeId: `stripId`,
    orderId: order.id,
    id: Types.ObjectId().toHexString()
  }
  await listener.onMessage(data, msg)
})

it (`changes order status to complete`, async () => {
  const order = await Order.findOne({ status: OrderStatus.Complete })
  expect(order).not.toBeNull()
  expect(order!.id).toBe(data.orderId)
})

it (`acks the message`, async () => {
  expect(msg.ack).toHaveBeenCalled()
})
