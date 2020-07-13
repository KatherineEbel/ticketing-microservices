// @ts-ignore
import mongoose from 'mongoose'

// interface to describe properties that create new user
interface TicketAttrs {
  title: string
  price: number
  userId: string
}

// interface describing properties of User Model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

// interface describing User Document properties
interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  userId: string
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    },
    versionKey: false
  }
})


ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
