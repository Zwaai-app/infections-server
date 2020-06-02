import {
  Either,
  left,
  right,
  map,
  getValidation,
  fromOption
} from 'fp-ts/lib/Either'
import { t } from '../i18n'
import { lift, lift2 } from '../utils/lift'
import { sequenceT, sequenceS } from 'fp-ts/lib/Apply'
import { pipe } from 'fp-ts/lib/pipeable'
import { NonEmptyArray, getSemigroup } from 'fp-ts/lib/NonEmptyArray'
import { RegistrationData } from './registerSlice'
import { constant, flow } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { compose } from 'rambda'
import {
  oneCapital,
  minLength,
  oneNumber,
  parseEmail
} from '../utils/validation'

export const tInvalidEmail = t(
  'registration.emailInvalid',
  'Geen geldig email adres'
)

export const tInvalidPhone = t(
  'registration.phoneInvalid',
  'Mobiel nummer is 8 cijfers'
)

export const tPasswordsDiffer = t(
  'registration.passwordsDiffer',
  'Wachtwoorden zijn niet hetzelfde'
)

export const tPasswordLength = t(
  'registration.passwordMinimalLength',
  'Wachtwoord heeft tenminste 8 karakters'
)

export const tPasswordOneCapital = t(
  'registration.passwordOneCapital',
  'Wachtwoord heeft tenminste een hoofdletter'
)

export const tPasswordOneNumber = t(
  'registration.passwordOneNumber',
  'Wachtwoord heeft tenminste een cijfer'
)

export const tConsentRequired = t(
  'registration.consentRequired',
  'U moet met de voorwaarden akkoord gaan'
)

export const emailValid = (email: string) =>
  flow(
    parseEmail,
    O.map(constant(email)),
    fromOption(constant(tInvalidEmail))
  )(email)

export const phoneValid = (phone: string): Either<string, string> =>
  /[0-9]{8}/.test(phone) ? right(phone) : left(tInvalidPhone)

export const consentValid = (c: boolean): Either<string, boolean> =>
  c ? right(true) : left(tConsentRequired)

export const equalPasswords = (
  p1: string,
  p2: string
): Either<string, string> => (p1 === p2 ? right(p1) : left(tPasswordsDiffer))

export const minPasswordLengthValidator = compose(
  fromOption(constant(tPasswordLength)),
  minLength(8)
)

export const oneCapitalValidator = compose(
  fromOption(constant(tPasswordOneCapital)),
  oneCapital
)

export const oneNumberValidator = compose(
  fromOption(constant(tPasswordOneNumber)),
  oneNumber
)

const applicativeValidation = () => getValidation(getSemigroup<string>())

export function passwordValid (
  p1: string,
  p2: string
): Either<NonEmptyArray<string>, string> {
  return pipe(
    sequenceT(applicativeValidation())(
      lift(minPasswordLengthValidator)(p1),
      lift(oneCapitalValidator)(p1),
      lift(oneNumberValidator)(p1),
      lift2(equalPasswords)(p1, p2)
    ),
    map(constant(p1))
  )
}

export function validateRegistrationData (
  email: string,
  phone: string,
  p1: string,
  p2: string,
  consent: boolean
): Either<NonEmptyArray<string>, RegistrationData> {
  return sequenceS(applicativeValidation())({
    email: lift(emailValid)(email),
    phone: lift(phoneValid)(phone),
    password: passwordValid(p1, p2),
    consented: lift(consentValid)(consent)
  })
}
