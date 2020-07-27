import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { validateRequest, BadRequestError } from '@ke-tickets/common'
import { User } from '../models/user'
import { Password } from '../services/password'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/api/users/signin', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
  ], validateRequest, async (req: Request, res:Response) => {
  const { email, password } = req.body
  const existingUser = await User.findOne({ email })
  if (!existingUser) {
    throw new BadRequestError('Invalid credentials')
  }
  const match = await Password.compare(existingUser.password, password)
  if (!match) {
    throw new BadRequestError('Invalid credentials')
  }

  const token = jwt.sign({
    id: existingUser.id,
    email: existingUser.email,
  }, global.process.env.JWT_KEY!)
  // store on session
  req.session = {
    jwt: token,
  }
  res.status(200).send(existingUser)
})

export { router as signinRouter }
