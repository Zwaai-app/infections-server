import sodium from 'libsodium-wrappers-sumo'

export class Scalar {
  static get size (): number {
    return sodium.crypto_core_ristretto255_SCALARBYTES
  }

  scalar: Uint8Array

  private constructor (scalarBytes: Uint8Array) {
    this.scalar = scalarBytes
  }

  get length (): number {
    return this.scalar.length
  }

  static random (): Scalar {
    return new Scalar(sodium.crypto_core_ristretto255_scalar_random())
  }
}

export { ready } from 'libsodium-wrappers-sumo'
