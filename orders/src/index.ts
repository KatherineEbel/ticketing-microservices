import mongoose from 'mongoose'
import { app } from './app'
import { stan } from './nats-client'
import { TicketCreatedListener } from './events/listeners/ticket-created-listener'
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener'
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener'

const start = async () => {
  const { NATS_CLIENT_ID, NATS_URL, NATS_CLUSTER_ID, JWT_KEY, MONGO_URI } = global.process.env
  if (!JWT_KEY || !MONGO_URI) {
    throw new Error('JWT_KEY or MONGO_URI not defined')
  }
  if (!NATS_CLIENT_ID || !NATS_URL || !NATS_CLUSTER_ID) {
    throw new Error('NATS env not configured')
  }
  try {
    await stan.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL)
    stan.client.on(`close`, () => {
      global.console.log(`NATS connection close`)
      global.process.exit()
    })
    global.process.on(`SIGINT`, () => stan.client.close())
    global.process.on(`SIGTERM`, () => stan.client.close())

    const stanClient = stan.client
    new TicketCreatedListener(stanClient).listen()
    new TicketUpdatedListener(stanClient).listen()
    new ExpirationCompleteListener(stanClient).listen()
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    global.console.log('Mongo connection complete!')
  } catch (e) {
    global.console.log('Error connecting to auth database: ', e.message)
  }

  app.listen(3000, () => {
    global.console.log ('Listening on port 3000!!!')
  })
}

start().then(() => {})
