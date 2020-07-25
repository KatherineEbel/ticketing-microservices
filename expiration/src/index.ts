import { stan } from './nats-client'
import { OrderCreatedListener } from './events/listeners/order-created-listener'

const start = async () => {
  const { NATS_CLIENT_ID, NATS_URL, NATS_CLUSTER_ID } = global.process.env
  if (!NATS_CLIENT_ID || !NATS_URL || !NATS_CLUSTER_ID) {
    throw new Error('NATS env not configured')
  }

  try {
    await stan.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL)
    stan.client.on(`close`, () => {
      console.log(`NATS connection close`)
      global.process.exit()
    })

    new OrderCreatedListener(stan.client).listen()

    global.process.on(`SIGINT`, () => stan.client.close())
    global.process.on(`SIGTERM`, () => stan.client.close())

  } catch (e) {
    console.log('Error connecting to auth database: ', e.message)
  }
}

start().then(() => {})
