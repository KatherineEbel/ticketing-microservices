import { Message } from 'node-nats-streaming'
import { Subject, Listener, TicketCreatedEvent, TicketData } from '@ke-tickets/common'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subject.TicketCreated
  queueGroupName = queueGroupName

  async onMessage (data: TicketData, msg: Message): Promise<void> {

    const { id, title, price } = data
    const ticket = Ticket.build({ id, title, price })
    await ticket.save()
    msg.ack()
  }


}
