import { Publisher, OrderCreatedEvent, Subject } from '@ke-tickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated
}
