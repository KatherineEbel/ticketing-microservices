import * as nats from 'node-nats-streaming'
import { randomBytes } from 'crypto'

console.clear()
// k port-forward nats-depl-67cbfbc6c5-lgcdn 8222:8222

const stan = nats.connect(`ticketing`, randomBytes(4).toString(`hex`), {
  url: `http://localhost:4222`
})

const options = stan.subscriptionOptions()
  .setManualAckMode(true)
  .setDeliverAllAvailable()

stan.on(`connect`, () => {
  console.log(`Listener connected to NATS`)

  stan.on(`close`, () => {
    console.log(`NATS connection closed`)

    process.exit()
  })

  const sub = stan.subscribe(
    `ticket:created`,
    `orders-service-queue-group`,
    options
  )
  sub.on(`message`, (msg) => {
    const data = msg.getData()
    if (typeof data === `string`) {
      console.log(
        `Received event #${msg.getSequence()}, with data: ${data}`
      )
    }
    msg.ack()
  })
})

process.on(`SIGINT`, () => stan.close())
process.on(`SIGTERM`, () => stan.close())
