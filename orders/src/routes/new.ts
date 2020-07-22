import express, { Request, Response } from 'express'
import { requireAuth, validateRequest } from '@ke-tickets/common'
import { body } from 'express-validator'
import { Types } from 'mongoose'

const router = express.Router()

router.post(`/api/orders`,
  requireAuth, [
  body(`ticketId`)
    .notEmpty()
    .custom((input: string) => Types.ObjectId.isValid(input))
    .withMessage(`Ticket id required`)
],
  validateRequest, async (req: Request, res: Response) => {
  res.send({})
})

export { router as createOrderRouter }
