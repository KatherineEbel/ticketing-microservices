import mongoose from 'mongoose'
import { app } from './app'

const start = async () => {
  if (!global.process.env.JWT_KEY || !global.process.env.MONGO_URI) {
    throw new Error('JWT_KEY or MONGO_URI not defined')
  }
  try {
    await mongoose.connect(global.process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log('Mongo connection complete!')
  } catch (e) {
    console.log('Error connecting to auth database: ', e.message)
    global.process.exit(1)
  }

  app.listen(3000, () => {
    console.log ('Listening on port 3000!!!!')
  })
}

start().then(() => {})
