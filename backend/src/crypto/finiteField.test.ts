import { ready, Scalar } from './finiteField'

it('exposes Sodium ready promise', async () => {
  await expect(ready).resolves.toBe(undefined)
})

describe('when ready', () => {
  beforeEach(async () => {
    await ready
  })

  it('can generate a random scalar', () => {
    expect(Scalar.random().length).toBe(Scalar.size)
  })
})
