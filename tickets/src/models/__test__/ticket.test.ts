import { Ticket } from '../ticket'

it (`implements optimistic concurrency control`, async (done) => {
  const ticket = Ticket.build({
    price: 5,
    title: 'ticket',
    userId: '123'
  })
  await ticket.save()
  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  firstInstance!.set({ price: 10 })
  secondInstance!.set({ price: 15 })
  await firstInstance!.save()

  try {
    await secondInstance!.save()
  } catch (e) {
    return done()
  }
  throw new Error(`Expected to throw VersionError`)
})

it (`increments the version number after each save`, async () => {
  const ticket = Ticket.build({
    price: 5,
    title: 'ticket',
    userId: '123'
  })
  await ticket.save()
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
  await ticket.save()
  expect(ticket.version).toEqual(2)
})
