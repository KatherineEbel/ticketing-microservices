import mongoose from 'mongoose'
import { app } from './app'
import { stan } from './nats-client'

const start = async () => {
  const { NATS_CLIENT_ID, NATS_URL, NATS_CLUSTER_ID, JWT_KEY, MONGO_URI } = process.env
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
      process.exit()
    })
    process.on(`SIGINT`, () => stan.client.close())
    process.on(`SIGTERM`, () => stan.client.close())
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    console.log('Mongo connection complete!')
  } catch (e) {
    console.log('Error connecting to auth database: ', e.message)
  }

  app.listen(3000, () => {
    console.log ('Listening on port 3000!!!')
  })
}

start().then(() => {})
