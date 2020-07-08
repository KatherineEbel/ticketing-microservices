import { ApiError } from './api-error'

export abstract class SerializableError extends Error {
  abstract statusCode: number

  protected constructor (message: string) {
    super (message);
    Object.setPrototypeOf(this, SerializableError.prototype)
  }

  abstract serialize(): ApiError[]
}
