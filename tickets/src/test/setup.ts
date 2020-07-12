import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest'

let mongo: MongoMemoryServer

declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<string[]>
    }
  }
}

global.signup = async () => {
  const email = `test@test.com`
  const password = `password`

  const response = await request(app)
    .post(`/api/users/signup`)
    .send({ email, password })
    .expect(201)
  return response.get('Set-Cookie')

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
