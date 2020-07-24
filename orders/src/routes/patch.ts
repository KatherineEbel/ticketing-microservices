import express, { Request, Response } from 'express'
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth } from '@ke-tickets/common'
import { Order, OrderStatus } from '../models/order'
import { Types } from 'mongoose'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { stan } from '../nats-client'

const router = express.Router()

router.patch(`/api/orders/:id`, requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError(`Bad Request`)
  }
  let order = await Order.findById(id).populate(`ticket`)
  if (!order) {
    throw new NotFoundError()
  }
  if (order.userId != req.currentUser!.id) {
    throw new NotAuthorizedError()
  }
  order.status = OrderStatus.Cancelled
  await order.save()

  await new OrderCancelledPublisher(stan.client).publish({
    ticketId: order.ticket.id,
    userId: order.userId,
    version: order.ticket.version
  })
  res.status(204).send(order)
})

export { router as patchOrderRouter }
