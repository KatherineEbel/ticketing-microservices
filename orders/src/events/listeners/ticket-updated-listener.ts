import { Message } from 'node-nats-streaming'
import { Subject, Listener, TicketData, TicketUpdatedEvent } from '@ke-tickets/common'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subject.TicketUpdated
  queueGroupName = queueGroupName

  async onMessage ({title, price, version, id}: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
    const ticket = await Ticket.findByEvent({ id, version })
    if (!ticket) {
      throw new Error(`Ticket not found`)
    }
    ticket.set({ title, price })
    await ticket.save()
    msg.ack()
  }



}
