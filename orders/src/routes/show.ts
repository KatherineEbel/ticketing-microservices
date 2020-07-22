import express, { Request, Response } from 'express'
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth } from '@ke-tickets/common'
import { Order } from '../models/order'
import { Types } from 'mongoose'

const router = express.Router()

router.get(`/api/orders/:id`, requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError(`Bad Request`)
  }
  const order = await Order.findById(id).populate(`ticket`)
  if (!order) {
    throw new NotFoundError()
  }
  if (order.userId != req.currentUser!.id) {
    throw new NotAuthorizedError()
  }
  res.send(order)
})

export { router as showOrderRouter }
