import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

let mongo: MongoMemoryServer

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[]
    }
  }
}

global.signin = () => {
  const payload = {
    id: 'asdf987',
    email: 'test@test.com'
  }
  const token = jwt.sign(payload, process.env.JWT_KEY!)
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
  const collections = await mongoose.connection.db.collections()
  for (const c of collections) {
    await c.deleteMany ({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})
