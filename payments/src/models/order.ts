import { Document, model, Model, Schema } from 'mongoose'
import { OrderStatus } from '@ke-tickets/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface OrderAttrs {
  id?: string
  version: number
  userId: string
  price: number
  status: OrderStatus
}

export interface OrderDoc extends Document {
  version: number
  userId: string
  price: number
  status: OrderStatus
}

interface OrderModel extends Model<OrderDoc>{
  build(attrs: OrderAttrs): OrderDoc
}

const schema = new Schema({
  version: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

schema.set(`versionKey`, `version`)
schema.plugin(updateIfCurrentPlugin)
schema.statics.build = (attrs: OrderAttrs) => new Order({
  _id: attrs.id,
  version: attrs.version,
  userId: attrs.userId,
  price: attrs.price,
  status: attrs.status,
})

const Order = model<OrderDoc, OrderModel>(`Order`, schema)

export { Order }

