import { Publisher, Subject, TicketUpdatedEvent } from '@ke-tickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  readonly subject = Subject.TicketUpdated
}
