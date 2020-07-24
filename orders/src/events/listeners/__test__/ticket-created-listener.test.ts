import { Message } from 'node-nats-streaming'
import { TicketCreatedListener } from '../ticket-created-listener'
import { stan } from '../../../nats-client'
import { TicketData } from '@ke-tickets/common'
import { Types } from 'mongoose'
import { Ticket } from '../../../models/ticket'

let listener: TicketCreatedListener
let data: TicketData
let msg: Message

beforeEach(async () => {
  listener = new TicketCreatedListener(stan.client)
  data = {
    version: 0,
    id: Types.ObjectId().toHexString(),
    price: 10,
    title: 'ticket',
    userId: Types.ObjectId().toHexString()
  }

  msg = {
    getTimestampRaw: jest.fn(),
    getCrc32: jest.fn(),
    getData: jest.fn(),
    getRawData: jest.fn(),
    getSequence: jest.fn(),
    getSubject: jest.fn(),
    getTimestamp: jest.fn(),
    isRedelivered: jest.fn(),
    ack: jest.fn()
  }

  await listener.onMessage(data, msg)
})

it (`created and saves a ticket`, async () => {
  const ticket = await Ticket.findById(data.id)
  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
})

it (`acks the message`, async () => {
  expect(msg.ack).toHaveBeenCalled()
})
