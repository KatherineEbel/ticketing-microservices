import { Listener, OrderCreatedEvent, Subject } from '@ke-tickets/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  async onMessage (data: OrderCreatedEvent["data"], msg: Message): Promise<void> {
    await Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    }).save()
    msg.ack()
  }

  queueGroupName = queueGroupName
  readonly subject = Subject.OrderCreated

}
