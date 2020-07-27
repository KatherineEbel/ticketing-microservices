import mongoose from 'mongoose'
import { app } from './app'
import { stan } from './nats-client'
import { OrderCreatedListener } from './events/listeners/order-created-listener'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'

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
      console.log(`NATS connection close`)
      global.process.exit()
    })

    global.process.on(`SIGINT`, () => stan.client.close())
    global.process.on(`SIGTERM`, () => stan.client.close())

    new OrderCreatedListener(stan.client).listen()
    new OrderCancelledListener(stan.client).listen()

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    console.log('Mongo connection complete!')
  } catch (e) {
    console.log('Error connecting to auth database: ', e.message)
    global.process.exit(1)
  }

  app.listen(3000, () => {
    console.log ('Listening on port 3000!!!')
  })
}

start().then(() => {})
