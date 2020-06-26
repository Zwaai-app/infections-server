import * as O from 'fp-ts/lib/Option'
import { constant } from 'fp-ts/lib/function'

export const autoCheckoutToNumber = (autoCheckout: O.Option<number>) =>
  O.getOrElse(constant(-1))(autoCheckout)

export const autoCheckoutFromNumber = (serverValue: number) =>
  serverValue < 0 ? O.none : O.some(serverValue)

export const dateFromServer = (serverValue: string) => Date.parse(serverValue)
