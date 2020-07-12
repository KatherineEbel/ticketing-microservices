import mongoose from 'mongoose'
import { app } from './app'

const start = async () => {
  if (!process.env.JWT_KEY || !process.env.MONGO_URI) {
    throw new Error('JWT_KEY or MONGO_URI not defined')
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log('Mongo connection complete!')
  } catch (e) {
    console.log('Error connecting to auth database: ', e.message)
  }

  app.listen(3000, () => {
    console.log ('Listening on port 3000!!!')
  })
}

start()
