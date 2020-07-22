import { connect } from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'

console.clear()

const stan = connect(`ticketing`, `abc`, {
  url: `http://localhost:4222`
})

stan.on(`connect`, async () => {
  console.log(`Publisher connected to NATS`)
  await new TicketCreatedPublisher(stan).publish({
    id: '123',
    price: 14.99,
    title: 'My Ticket'
  })
})
