import { Publisher, OrderCancelledEvent, Subject } from '@ke-tickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subject.OrderCancelled
}
