import Queue from 'bull'
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher'
import { stan } from '../nats-client'

export interface Payload {
  orderId: string

}

const expirationQueue = new Queue<Payload>(`order:expiration`, {
  redis: {
    host: global.process.env.REDIS_HOST
  }
})

expirationQueue.process(async ({ data }) => {
  await new ExpirationCompletePublisher(stan.client).publish({ orderId: data.orderId })
})

export { expirationQueue }
