import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { validateRequest, requireAuth } from '@ke-tickets/common'
import { Ticket } from '../models/ticket'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'
import { stan } from '../nats-client'

const router = express.Router()

router.post(`/api/tickets`, requireAuth, [
  body(`title`)
    .notEmpty()
    .withMessage(`Title is required`),
  body(`price`)
    .isFloat({ gt: 0 })
    .withMessage(`Price must be greater than 0`)
], validateRequest, async (req:Request, res:Response) => {
  const { title, price } = req.body
  const ticket = await Ticket.build({title, price, userId: req.currentUser!.id }).save()
  await new TicketCreatedPublisher(stan.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version
  })
  res.status(201).send(ticket)
})
export { router as createTicketRouter }
