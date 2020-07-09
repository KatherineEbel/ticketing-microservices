import { SerializableError } from './serializable-error'
import { ApiError } from './api-error'

export class BadRequestError extends SerializableError {
  statusCode = 400

  constructor (public message: string) {
    super (message);
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serialize (): ApiError[] {
    return [{ message: this.message}];
  }

}
