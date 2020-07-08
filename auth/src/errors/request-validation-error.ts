import { ValidationError } from 'express-validator'
import { SerializableError } from './serializable-error'

export class RequestValidationError extends SerializableError {
  statusCode = 400

  constructor (private errors: ValidationError[]) {
    super('Invalid request parameters')
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serialize() {
    return this.errors
      .map(({ msg, param}) => ({ message: msg, field: param}))
  }
}
