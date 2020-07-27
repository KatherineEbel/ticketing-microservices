import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError, NotAuthorizedError, OrderStatus
} from '@ke-tickets/common'
import { Order } from '../models/order'
import { stripe } from '../stripe'
import { Payment } from '../models/payment'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'
import { stan } from '../nats-client'

const router = Router()

router.post(`/api/payments`,
  requireAuth, [
  body(`token`)
    .notEmpty()
    .withMessage(`missing token`),
  body(`orderId`)
    .notEmpty()
    .withMessage(`missing order id`)
], validateRequest, async (req: Request, res: Response) => {
  const { token, orderId } = req.body
    const order = await Order.findById(orderId)
    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError(`Order Cancelled`)
    }

    const charge = await stripe.charges.create({
      currency: `usd`,
      amount: order.price * 100,
      source: token,
    })

    const payment = await Payment.build({
      orderId,
      stripeId: charge.id,
    }).save()
    await new PaymentCreatedPublisher(stan.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.id
    })
  res.status(201).send({ id: payment.id })
})

export { router as createChargeRouter }
