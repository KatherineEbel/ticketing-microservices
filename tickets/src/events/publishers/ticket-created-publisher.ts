import { Publisher, Subject, TicketCreatedEvent } from '@ke-tickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  readonly subject = Subject.TicketCreated

  publish (data: TicketCreatedEvent["data"]): Promise<void> {
    return super.publish (data);
  }
}
