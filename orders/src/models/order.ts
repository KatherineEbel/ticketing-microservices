import { Document, model, Model, Schema } from 'mongoose'
// @ts-ignore
import { OrderStatus } from '@ke-tickets/common'
import { TicketDoc } from './ticket'

interface OrderAttrs {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
}

interface OrderDoc extends Document {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
}

interface OrderModel extends Model<OrderDoc> {
  ttl: number
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt: {
    type: Schema.Types.Date
  },
  ticket: {
    type: Schema.Types.ObjectId,
    ref: `Ticket`
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})



orderSchema.statics.build = (attrs: OrderAttrs) => new Order(attrs)
orderSchema.statics.ttl = 5 * 60 // amount of time to complete order

const Order = model<OrderDoc, OrderModel>(`Order`, orderSchema)

export { Order, OrderStatus }
