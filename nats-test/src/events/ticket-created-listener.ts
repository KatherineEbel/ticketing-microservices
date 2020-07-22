import { Message } from 'node-nats-streaming'
import { Listener } from './base-listener'
import { TicketCreatedEvent } from './ticket-created-event'
import { Subject } from './subject'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  queueGroupName = `payments-service`
  readonly subject = Subject.TicketCreated

  onMessage (data: TicketCreatedEvent['data'], msg: Message): void {
    console.log(`Got event with data/n:`, data)
    msg.ack()
  }
}
