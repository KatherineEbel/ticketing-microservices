import { connect as conn, Stan } from 'node-nats-streaming'

class NatsClient {
  private _stan?: Stan

  get client() {
    if (!this._stan) {
      throw new Error(`Cannot access NATS client before connecting`)
    }
    return this._stan
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._stan = conn(clusterId, clientId, { url })
    return new Promise((resolve, reject) => {
      this._stan!.on(`connect`, () => {
        console.log(`Connected to NATS`)
        resolve()
      })
      this._stan!.on(`error`, err => reject(err))
    })
  }
}

export const stan = new NatsClient()
