import { Document, model, Model, Schema } from 'mongoose'
import { OrderStatus } from '@ke-tickets/common'
import { TicketDoc } from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface OrderAttrs {
  id?: string
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
}

export interface OrderDoc extends Document {
  id: string
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
  version: number
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
    enum: Object.values(<object>OrderStatus),
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


orderSchema.set(`versionKey`, `version`)
orderSchema.plugin(updateIfCurrentPlugin)
orderSchema.statics.build = (attrs: OrderAttrs) => new Order(attrs)
orderSchema.statics.ttl = 60  // amount of time to complete order

const Order = model<OrderDoc, OrderModel>(`Order`, orderSchema)
export { Order, OrderStatus }
