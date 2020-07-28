import express from 'express'
import 'express-async-errors'

import { currentUser, errorHandler, NotFoundError } from '@ke-tickets/common'
import cookieSession from 'cookie-session'
import { createOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'
import { indexOrderRouter } from './routes'
import { patchOrderRouter } from './routes/patch'

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(
  cookieSession({
    signed: false,
    // secure: global.process.env.NODE_ENV !== `test`, // disable until https setup
    secure: false,
  })
)

app.use(currentUser)
app.use(createOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)
app.use(patchOrderRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
