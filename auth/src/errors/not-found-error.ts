import { SerializableError } from './serializable-error'
import { ApiError } from './api-error'

export class NotFoundError extends SerializableError {
  statusCode = 404

  constructor () {
    super('Resource Not Found')
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serialize (): ApiError[] {
    return [{ message: 'Not Found'}];
  }

}
