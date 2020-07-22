import { Subject } from './subject'

export interface TicketData {
  id: string
  title: string
  price: number
}

export interface TicketCreatedEvent {
  subject: Subject.TicketCreated
  data: TicketData
}
