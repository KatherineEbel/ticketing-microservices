import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { User } from '../models/user'
import { BadRequestError, validateRequest } from '@ke-tickets/common'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
], validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body
  const existingUser = await User.findOne(({ email }))
  if (existingUser) {
    throw new BadRequestError('Email not available')
  }
  const user = User.build({ email, password })
  await user.save()
  // generate jwt
  const token = jwt.sign({
    id: user.id,
    email: user.email,
  }, global.process.env.JWT_KEY!)
  // store on session
  req.session = {
    jwt: token,
  }
  res.status(201).send(user)
})

export { router as signupRouter }
