import mongoose from 'mongoose'
import { Order, OrderStatus } from './order'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttrs {
  id?: string
  title: string
  price: number
}

export interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  version: number
  reserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
  findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>
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

schema.set(`versionKey`, `version`)
schema.plugin(updateIfCurrentPlugin)

schema.statics.build = ({id, title, price}: TicketAttrs) => new Ticket({
  _id: id,
  title,
  price,
})

schema.statics.findByEvent= (event: { id: string, version: number}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  })
}

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

