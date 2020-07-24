import { Message } from 'node-nats-streaming'
import { Listener, OrderCancelledEvent, Subject } from '@ke-tickets/common'
import { queueGroupName } from './queueGroupName'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  async onMessage (data: OrderCancelledEvent["data"], msg: Message): Promise<void> {
    const ticket = await Ticket.findById(data.ticketId)
    if (!ticket) {
      throw new Error(`Ticket not found`)
    }
    await ticket.set({ orderId: undefined }).save()
    await new TicketUpdatedPublisher(this.client).publish({
      version: ticket.version,
      orderId: undefined,
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
      id: ticket.id
    })
    msg.ack()
  }

  queueGroupName = queueGroupName
  readonly subject = Subject.OrderCancelled

}
