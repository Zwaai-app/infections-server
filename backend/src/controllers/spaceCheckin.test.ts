import {
  getTimeCodes,
  initialize,
  App,
  RouteHandler,
  postSpaceCheckin
} from './spaceCheckin'
import { GroupElement, Scalar, ready } from '../crypto/finiteField'
import { Request, Response } from 'express'
import { ValidationChain } from 'express-validator'

it('has an empty list of time codes', () => {
  expect(getTimeCodes()).toStrictEqual([])
})

describe('given an app spy', () => {
  let appSpy: AppSpy

  beforeEach(() => {
    appSpy = new AppSpy()
  })

  it('has a list of time codes after initialization', async () => {
    await expect(initialize(appSpy)).resolves.toBeUndefined()
    expect(getTimeCodes()).toHaveLength(
      8 /* hours */ * 12 /* every 5 minutes */
    )
  })

  describe('when initialized', () => {
    beforeEach(async () => {
      await initialize(appSpy)
    })

    it('has installed app route after initialization', async () => {
      expect(appSpy.sanitizers['/api/v1/space/checkin']).toBe(
        postSpaceCheckin.sanitizers
      )
      expect(appSpy.postRoutes['/api/v1/space/checkin']).toBeDefined()
    })

    it('sends first time code when calling handler', () => {
      const handler = appSpy.postRoutes['/api/v1/space/checkin']
      const rl = GroupElement.random()
      const req = { body: { encryptedLocation: rl.toHexString() } }
      const res = new ResponseSpy()
      handler(req as Request, (res as unknown) as Response, () => undefined)
      expect(res.headers['Content-Type']).toEqual('application/json')
      expect(res.sent).toHaveLength(1)

      const t = getTimeCodes()[0]
      const trl = t.multiply(rl)
      expect(JSON.parse(res.sent[0]).encryptedLocationTime).toEqual(
        trl.toHexString()
      )
    })
  })
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

class AppSpy implements App {
  postRoutes: Record<string, RouteHandler> = {}
  sanitizers: Record<string, ValidationChain[]> = {}

  post (
    path: string,
    sanitizers: ValidationChain[],
    handler: RouteHandler
  ): void {
    this.sanitizers[path] = sanitizers
    this.postRoutes[path] = handler
  }
}

class ResponseSpy {
  sent: string[] = []
  sentStatuses: number[] = []
  headers: Record<string, string> = {}

  setHeader (key: string, value: string) {
    this.headers[key] = value
  }

  send (msg: string) {
    this.sent.push(msg)
  }

  json (o: object) {
    this.sent.push(JSON.stringify(o))
  }

  status (status: number): ResponseSpy {
    this.sentStatuses.push(status)
    return this
  }
}
