import * as O from 'fp-ts/lib/Option'
import { constant } from 'fp-ts/lib/function'

export const autoCheckoutToServer = (autoCheckout: O.Option<number>) =>
  O.getOrElse(constant(-1))(autoCheckout)

export const convertAutoCheckoutFromServer = (serverValue: number) =>
  serverValue < 0 ? O.none : O.some(serverValue)

export const convertDateFromServer = (serverValue: string) =>
  Date.parse(serverValue)
