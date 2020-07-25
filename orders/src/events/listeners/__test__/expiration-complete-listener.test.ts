import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { ExpirationCompleteData, OrderStatus } from '@ke-tickets/common'
import { Message } from 'node-nats-streaming'
import { stan } from '../../../nats-client'
import { Types } from 'mongoose'
import { Order, OrderDoc } from '../../../models/order'
import { Ticket } from '../../../models/ticket'

let listener: ExpirationCompleteListener
let data: ExpirationCompleteData
let order: OrderDoc
let msg: Message

beforeEach(async () => {
  listener = new ExpirationCompleteListener(stan.client)
  const ticket = await Ticket.build({
    title: "concert",
    price: 20,
  }).save()

  order = await Order.build({
    userId: Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket
  }).save()

  data = {
    orderId: order.id
  }

  // @ts-ignore
  msg = <Message>{
    ack: jest.fn(),
  }
})

describe(`status created`, () => {
  beforeEach(async () => {
    await listener.onMessage(data, msg)
  })

  it (`sets the status of the order to cancelled`, async () => {
    const order = await Order.findById(data.orderId)
    expect(order!.status).toBe(OrderStatus.Cancelled)
  })

  it (`acks the message`, async () => {
    expect(stan.client.publish).toHaveBeenCalled()
  })

  it (`emits an Order Cancelled event`, async () => {
    const eventData = JSON.parse((stan.client.publish as jest.Mock).mock.calls[0][1])
    const event = (stan.client.publish as jest.Mock).mock.calls[0][0]
    expect(eventData.orderId).toBe(order.id)
    expect(event).toBe(`order:cancelled`)
  })

})

describe(`completed order`, () => {
  it (`doesn't change status if order is completed`, async () => {
    await order.set({status: OrderStatus.Complete}).save()
    await listener.onMessage(data, msg)
    expect(order.status).not.toBe(OrderStatus.Cancelled)
  })
})

