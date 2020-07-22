import mongoose from 'mongoose'
import { Order, OrderStatus } from './order'

interface TicketAttrs {
  title: string
  price: number
}

export interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  reserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

schema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs)
schema.methods.reserved = async function () {
  const order = await Order.findOne({
    ticket: this.id,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });
  return !!order
}

export const Ticket = mongoose.model<TicketDoc, TicketModel>(`Ticket`, schema)

