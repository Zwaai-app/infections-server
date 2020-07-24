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

export class GroupElement {
  static get size (): number {
    return sodium.crypto_core_ristretto255_BYTES
  }

  groupElement: Uint8Array

  private constructor (groupElementBytes: Uint8Array) {
    this.groupElement = groupElementBytes
  }

  get length (): number {
    return this.groupElement.length
  }

  static random (): GroupElement {
    return new GroupElement(sodium.crypto_core_ristretto255_random())
  }
}

export { ready } from 'libsodium-wrappers-sumo'
