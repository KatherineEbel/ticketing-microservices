import express from 'express'
import 'express-async-errors'

import { currentUser, errorHandler, NotFoundError } from '@ke-tickets/common'
import cookieSession from 'cookie-session'
import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { indexTicketsRouter } from './routes'
import { updateTicketRouter } from './routes/update'

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
app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketsRouter)
app.use(updateTicketRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
