import express, { Request, Response } from 'express'
import { BadRequestError, NotFoundError, requireAuth, validateRequest } from '@ke-tickets/common'
import { body } from 'express-validator'
import { Types } from 'mongoose'
import { Ticket } from '../models/ticket'
import { Order, OrderStatus } from '../models/order'
import { OrderCreatedPublisher } from '../publishers/order-created-publisher'
import { stan } from '../nats-client'

const router = express.Router()

router.post(`/api/orders`,
  requireAuth, [
  body(`ticketId`)
    .notEmpty()
    .custom((input: string) => Types.ObjectId.isValid(input))
    .withMessage(`Ticket id required`)
],
  validateRequest, async (req: Request, res: Response) => {
  const { ticketId } = req.body
    // find ticket the user is trying to order
    let ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }
    // make sure ticket isn't already reserved
    if (await ticket.reserved()) {
      throw new BadRequestError(`Ticket not available`)
    }
    // Calculate expiration date for order
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + Order.ttl)
    // Build the order and save it to database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt,
      ticket
    })
    await order.save()
    // Publish and event about created order
    await new OrderCreatedPublisher(stan.client).publish({
      id: order.id,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price
      },
      userId: order.userId
    })

    res.status(201).send(order)
})

export { router as createOrderRouter }
