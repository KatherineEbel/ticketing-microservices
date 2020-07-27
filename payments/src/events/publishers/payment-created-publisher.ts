import { PaymentCreatedEvent, Publisher, Subject } from '@ke-tickets/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subject.PaymentCreated
}
