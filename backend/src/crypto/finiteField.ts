import sodium from 'libsodium-wrappers-sumo'
import * as O from 'fp-ts/lib/Option'

export class Scalar {
  static get size (): number {
    return sodium.crypto_core_ristretto255_SCALARBYTES
  }

  readonly scalar: Uint8Array

  /**
   * Don't use this constructor directly, use `Scalar.random()`
   * and the arithmetics instead.
   *
   * @param scalarBytes Raw bytes representing the scalar
   */
  constructor (scalarBytes: Uint8Array) {
    this.scalar = scalarBytes
  }

  get length (): number {
    return this.scalar.length
  }

  static random (): Scalar {
    return new Scalar(sodium.crypto_core_ristretto255_scalar_random())
  }

  /**
   * Performs a multiplication of this scalar by the given group element
   * in the finite field.
   *
   * @param rhs the group element to multiply this scalar with
   */
  multiply (rhs: GroupElement): GroupElement {
    const result = sodium.crypto_scalarmult_ristretto255(
      this.scalar,
      rhs.groupElement
    )
    return new GroupElement(result)
  }
}

export class GroupElement {
  static get size (): number {
    return sodium.crypto_core_ristretto255_BYTES
  }

  readonly groupElement: Uint8Array

  /**
   * Don't use this constructor directly, use `GroupElement.random()`
   * and the arithmetics instead.
   *
   * @param scalarBytes Raw bytes representing the group element
   */
  constructor (groupElementBytes: Uint8Array) {
    this.groupElement = groupElementBytes
  }

  get length (): number {
    return this.groupElement.length
  }

  static random (): GroupElement {
    return new GroupElement(sodium.crypto_core_ristretto255_random())
  }

  /**
   * Performs a division of the group element by a scalar in the finite field.
   *
   * @param denominator the denominator (scalar) of the division
   */
  divide (denominator: Scalar): GroupElement {
    const denominatorInverse = new Scalar(
      sodium.crypto_core_ristretto255_scalar_invert(denominator.scalar)
    )
    return denominatorInverse.multiply(this)
  }

  toHexString (): string {
    return Buffer.from(this.groupElement).toString('hex')
  }

  static fromHexString (hex: string): O.Option<GroupElement> {
    if (hex.match(/[0-9a-f]{64}/i)) {
      return O.some(new GroupElement(Uint8Array.from(Buffer.from(hex, 'hex'))))
    } else {
      return O.none
    }
  }
}

export { ready } from 'libsodium-wrappers-sumo'
