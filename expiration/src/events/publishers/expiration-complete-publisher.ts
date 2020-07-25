import { ExpirationCompleteEvent, Publisher, Subject } from '@ke-tickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subject.ExpirationComplete

  publish (data: ExpirationCompleteEvent["data"]): Promise<void> {
    console.log(`Event published to: ${this.subject}`)
    return super.publish (data);
  }

}
