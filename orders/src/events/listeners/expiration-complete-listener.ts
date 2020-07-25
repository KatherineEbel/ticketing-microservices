import { Message } from 'node-nats-streaming'
import { ExpirationCompleteData, ExpirationCompleteEvent, Listener, OrderStatus, Subject } from '@ke-tickets/common'
import { queueGroupName } from './queue-group-name'
import { Order, OrderDoc } from '../../models/order'
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher'

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
  async onMessage (data: ExpirationCompleteData, msg: Message): Promise<void> {
    const order = await Order.findById(data.orderId).populate(`ticket`)
    if (!order) {
      throw new Error(`Unknown order`)
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack()
    }
    await order.set({
      status: OrderStatus.Cancelled
    }).save()
    await new OrderCancelledPublisher(this.client).publish({
      ticketId: order.ticket.id,
      version: order.version,
      orderId: order.id
    })
    msg.ack()
  }

  queueGroupName = queueGroupName
  readonly subject = Subject.ExpirationComplete

}
