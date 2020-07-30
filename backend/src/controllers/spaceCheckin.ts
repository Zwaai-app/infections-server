import { ready, Scalar, GroupElement } from '@zwaai/common'
import { Express } from 'express-serve-static-core'
import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import * as O from 'fp-ts/lib/Option'

const maxAutoCheckoutHours = 8
const minutesPerTimeCode = 5

let globalTimeCodes: Scalar[] = []

export function getTimeCodes (): Scalar[] {
  return globalTimeCodes
}

export async function initialize (app: App | Express) {
  globalTimeCodes = []
  await ready
  for (let i = 0; i < (maxAutoCheckoutHours * 60) / minutesPerTimeCode; i++) {
    globalTimeCodes.push(Scalar.random())
  }

  app.post(
    '/api/v1/space/checkin',
    postSpaceCheckin.sanitizers,
    postSpaceCheckin.apiHandler
  )
}

const postSpaceCheckinApi: RouteHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.setHeader('Content-Type', 'application/json')

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const encryptedLocation = GroupElement.fromHexString(
    req.body.encryptedLocation
  )
  O.fold(
    () => {
      res.status(400).json({ errors: ['invalid encrypted location'] })
    },
    (encryptedLocation: GroupElement) => {
      // This always sends the full 8 hours worth of time codes, regardless
      // of how many you actually need. This minimizes the information the
      // server and somebody profiling the communication have about check-ins.
      const encryptedLocationTimeCodes = getTimeCodes().map(t =>
        t.multiply(encryptedLocation).toHexString()
      )
      res.status(200).json({ encryptedLocationTimeCodes })
    }
  )(encryptedLocation)
}

// 64 is the size of the Ristretto field elements. I'd like to dynamically add it
// here, but libsodium's constants are only available after the promise `ready` is
// fulfilled. So Just hard-coding it here :(
const encryptedLocationSanitizer = body('encryptedLocation').matches(
  /^[a-f0-9]{64}$/
)

const postSpaceCheckinApiSanitizers = [encryptedLocationSanitizer]

export const postSpaceCheckin = {
  apiHandler: postSpaceCheckinApi,
  sanitizers: postSpaceCheckinApiSanitizers
}

export interface App {
  post(path: string, sanitizers: any[], handler: RouteHandler): void
}

export type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void
