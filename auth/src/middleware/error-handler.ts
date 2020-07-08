import { Request, Response, NextFunction } from 'express'
import { SerializableError } from '../errors/serializable-error'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SerializableError) {
    return res.status(err.statusCode).json({ errors: err.serialize() })
  }
  res.status(400).send({ errors: [{ message: "Something went wrong"}] })
}
