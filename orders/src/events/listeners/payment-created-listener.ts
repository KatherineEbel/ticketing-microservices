import { Listener, OrderStatus, PaymentCreatedEvent, PaymentData, Subject } from '@ke-tickets/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  queueGroupName = queueGroupName
  readonly subject = Subject.PaymentCreated

  async onMessage (data: PaymentData, msg: Message): Promise<void> {
    const order = await Order.findOne({ _id: data.orderId })
    if (!order) {
      throw new Error(`Order not found`)
    }
    await order.set({ status: OrderStatus.Complete }).save()
    msg.ack()
  }

}
