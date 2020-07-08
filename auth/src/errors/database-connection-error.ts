import { SerializableError } from './serializable-error'

export class DatabaseConnectionError extends SerializableError {
  reason = `Error connecting to database`
  statusCode = 500

  constructor () {
    super (`Error connecting to database`)
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serialize() {
    return [
      { message: this.reason }
    ]
  }
}
