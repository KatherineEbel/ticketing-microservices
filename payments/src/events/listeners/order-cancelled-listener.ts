import { Listener, OrderCancelledEvent, OrderStatus, Subject } from '@ke-tickets/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  async onMessage (data: OrderCancelledEvent["data"], msg: Message): Promise<void> {
    const order = await Order.findOne({ _id: data.orderId, version: data.version - 1 })
    if (!order) {
      throw new Error(`Order not found`)
    }
    await order.set({ status: OrderStatus.Cancelled}).save()
    msg.ack()
  }

  queueGroupName = queueGroupName
  readonly subject = Subject.OrderCancelled

}
