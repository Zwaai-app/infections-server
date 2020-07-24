import { ready, Scalar, GroupElement } from './finiteField'
import * as O from 'fp-ts/lib/Option'

it('exposes Sodium ready promise', async () => {
  await expect(ready).resolves.toBeUndefined()
})

describe('when ready', () => {
  beforeEach(async () => {
    await ready
  })

  it('can generate a random scalar', () => {
    const r1 = Scalar.random()
    const r2 = Scalar.random()
    expect(r1.length).toBe(Scalar.size)
    expect(r2).not.toStrictEqual(r1)
  })

  it('can generate random group elements', () => {
    const r1 = GroupElement.random()
    const r2 = GroupElement.random()
    expect(r1.length).toBe(GroupElement.size)
    expect(r2).not.toStrictEqual(r1)
  })

  it('can multiply and divide', () => {
    const s = Scalar.random()
    const g = GroupElement.random()
    const sg = s.multiply(g)
    const gPrime = sg.divide(s)
    expect(gPrime).toStrictEqual(g)
  })

  it('can encode a group element as a hex string', () => {
    const g = GroupElement.random()
    const hex = g.toHexString()
    const gPrime = O.toNullable(GroupElement.fromHexString(hex))
    expect(gPrime).toStrictEqual(g)
  })

  it('fails to decode invalid hex string', () => {
    expect(O.toUndefined(GroupElement.fromHexString('invalid'))).toBeUndefined()
  })
})
