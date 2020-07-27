import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

jest.mock('../nats-client')

let mongo: MongoMemoryServer

declare global {
  namespace NodeJS {
    interface Global {
      signin (id?: string): string[]
    }
  }
}

global.signin = (id?: string) => {
  const payload = {
    id: id || mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  const token = jwt.sign(payload, global.process.env.JWT_KEY!)
  const session = {
    jwt: token
  }
  const sessionJSON = JSON.stringify(session)
  const base64 = Buffer.from(sessionJSON).toString('base64')
  return [`express:sess=${base64}`]
}

beforeAll(async () => {
  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for (const c of collections) {
    await c.deleteMany ({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})
