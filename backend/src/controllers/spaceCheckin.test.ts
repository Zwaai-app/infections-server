import { getTimeCodes } from './spaceCheckin'
import { GroupElement, Scalar, ready } from '../crypto/finiteField'

it('has an empty list of time codes', () => {
  expect(getTimeCodes()).toStrictEqual([])
})

describe('when sodium ready', () => {
  beforeEach(async () => {
    await ready
  })

  it('proves that protocol works', () => {
    const [l, lt, t] = singleRound()
    expect(l).toStrictEqual(lt.divide(t))
  })
})

// This is what the protocol for checking in basically does:
function singleRound (): [GroupElement, GroupElement, Scalar] {
  // Client scans location code `l` and combines it with random `r`
  const r = Scalar.random()
  const l = GroupElement.random()
  const lr = r.multiply(l)

  // Server combines it with time code `t`
  const t = Scalar.random()
  const lrt = t.multiply(lr)

  // Client removes random `r` and stores `lt`
  const lt = lrt.divide(r)

  return [l, lt, t]
}
