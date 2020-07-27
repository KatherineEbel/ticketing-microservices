import request from 'supertest'
import { app } from '../../app'
import { Types } from 'mongoose'
import { Order } from '../../models/order'
import { OrderStatus } from '@ke-tickets/common'
import { stripe } from '../../stripe'
import { Payment } from '../../models/payment'

// jest.mock('../../stripe')

describe(`create new charges`, () => {
  it (`responds with 404 if order does not exist`, async () => {
    await request(app)
      .post(`/api/payments`)
      .set(`Cookie`, global.signin())
      .send({
        token: `my stripe token`,
        orderId: Types.ObjectId().toHexString(),
      })
      .expect(404)
  })

  it (`responds with 401 if order does not belong to logged in user`, async () => {
    const order = await Order.build({
      price: 10,
      status: OrderStatus.Created,
      version: 0,
      userId: Types.ObjectId().toHexString()
    }).save()
    await request(app)
      .post(`/api/payments`)
      .set(`Cookie`, global.signin())
      .send({
        token: `my stripe token`,
        orderId: order.id,
      })
      .expect(401)
  })

  it (`returns 400 if order has already been cancelled`, async () => {
    const userId = Types.ObjectId().toHexString()
    const order = await Order.build({
      price: 10,
      status: OrderStatus.Cancelled,
      version: 0,
      userId
    }).save()
    await request(app)
      .post(`/api/payments`)
      .set(`Cookie`, global.signin(userId))
      .send({
        token: `my stripe token`,
        orderId: order.id,
      })
      .expect(400)
  })

  it (`responds with 201 when inputs are valid`, async () => {
    const userId = Types.ObjectId().toHexString()
    const price = Math.floor(Math.random() * 100000)
    const order = await Order.build({
      userId,
      price,
      status: OrderStatus.Created,
      version: 0,
    }).save()
    const { body: chargeRes } = await request(app)
      .post(`/api/payments`)
      .set(`Cookie`, global.signin(userId))
      .send({
        token: `tok_visa`,
        orderId: order.id,
      })
      .expect(201)

    expect(chargeRes.id).not.toBeUndefined()

    // use mock stripe
    // expect(stripe.charges.create).toHaveBeenCalledWith({
    //   currency: `usd`,
    //   amount: order.price * 100,
    //   source: `tok_visa`})

    // use test stripe
    const { data } = await stripe.charges.list({ limit: 10 })
    const charge = data.find(c => c.amount === price * 100)
    expect(charge).toBeDefined()
    expect(charge!.currency).toBe(`usd`)

    const payment = await Payment.findOne({
      orderId: order.id, stripeId: charge!.id
    })
    expect(payment).not.toBeNull()
  })

})

