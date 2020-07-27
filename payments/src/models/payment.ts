import { Document, model, Model, Schema } from 'mongoose'

interface PaymentAttrs {
  orderId: string
  stripeId: string
}

interface PaymentDoc extends Document {
  orderId: string
  stripeId: string
}

interface PaymentModel extends Model<PaymentDoc>{
  build(attrs: PaymentAttrs): PaymentDoc
}

const schema = new Schema({
  orderId: {
    type: String,
    required: true,
  },
  stripeId: {
    type: String,
    required: true,
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = doc._id
      delete ret._id
    }
  }
})

schema.statics.build = (attrs: PaymentAttrs) => new Payment(attrs)

const Payment = model<PaymentDoc, PaymentModel>(`Payment`, schema)

export { Payment }
