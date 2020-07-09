import { SerializableError } from './serializable-error'
import { ApiError } from './api-error'

export class NotAuthorizedError extends SerializableError {
  statusCode = 401

  constructor () {
    super ("Not Authorized");
    Object.setPrototypeOf(this, NotAuthorizedError.prototype)
  }

  serialize (): ApiError[] {
    return [{ message: "Not Authorized"}];
  }

}
