import { Message } from 'node-nats-streaming'
import { TicketUpdatedListener } from '../ticket-updated-listener'
import { Ticket, TicketDoc } from '../../../models/ticket'
import { TicketData } from '@ke-tickets/common'
import { stan } from '../../../nats-client'
import { Types } from 'mongoose'

let listener: TicketUpdatedListener
let ticket: TicketDoc
let data: TicketData
let msg: Message

beforeEach(async () => {
  listener = new TicketUpdatedListener(stan.client)
  ticket = await Ticket.build({
    title: 'ticket',
    price: 10,
  }).save()

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

  data = {
    title: 'updated',
    price: 20,
    version: ticket.version + 1,
    id: ticket.id,
    userId: Types.ObjectId().toHexString()
  }
})

it (`finds, updates, and saves a ticket`, async () => {
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.version).toEqual(1)
  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
})

it (`acks the ticket updated msg`, async () => {
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it (`does not ack msg if version number skipped`, async () => {
  data.version = 10

  try {

    await listener.onMessage(data, msg)
  } catch (e) {}
  expect(msg.ack).not.toHaveBeenCalled()
})
