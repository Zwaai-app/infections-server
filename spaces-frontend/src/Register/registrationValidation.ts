import { Either, left, right, map, getValidation } from 'fp-ts/lib/Either'
import { t } from '../i18n'
import { lift, lift2 } from '../utils/lift'
import { sequenceT, sequenceS } from 'fp-ts/lib/Apply'
import { pipe } from 'fp-ts/lib/pipeable'
import { NonEmptyArray, getSemigroup } from 'fp-ts/lib/NonEmptyArray'
import emailAddress from 'email-addresses'
import { RegistrationData } from './registerSlice'
import { constant } from 'fp-ts/lib/function'

const emailValid = (email: string): Either<string, string> =>
  // tslint:disable-next-line: strict-type-predicates
  emailAddress.parseOneAddress(email) !== null
    ? right(email)
    : left(tInvalidEmail)

const phoneValid = (phone: string): Either<string, string> =>
  /[0-9]{8}/.test(phone) ? right(phone) : left(tInvalidPhone)

const consentValid = (c: boolean): Either<string, boolean> =>
  c ? right(true) : left(tConsentRequired)

export const equalPasswords = (
  p1: string,
  p2: string
): Either<string, string> => (p1 === p2 ? right(p1) : left(tPasswordsDiffer))

const minLength = (s: string): Either<string, string> =>
  s.length >= 8 ? right(s) : left(tPasswordLength)

const oneCapital = (s: string): Either<string, string> =>
  /[A-Z]/g.test(s) ? right(s) : left(tPasswordOneCapital)

const oneNumber = (s: string): Either<string, string> =>
  /[0-9]/g.test(s) ? right(s) : left(tPasswordOneNumber)

const applicativeValidation = () => getValidation(getSemigroup<string>())

function passwordValid (
  p1: string,
  p2: string
): Either<NonEmptyArray<string>, string> {
  return pipe(
    sequenceT(applicativeValidation())(
      lift(minLength)(p1),
      lift(oneCapital)(p1),
      lift(oneNumber)(p1),
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

const tInvalidEmail = t('registration.emailInvalid', 'Geen geldig email adres')

const tInvalidPhone = t(
  'registration.phoneInvalid',
  'Mobiel nummer is 8 cijfers'
)

const tPasswordsDiffer = t(
  'registration.passwordsDiffer',
  'Wachtwoorden zijn niet hetzelfde'
)

const tPasswordLength = t(
  'registration.passwordMinimalLength',
  'Wachtwoord heeft tenminste 8 karakters'
)

const tPasswordOneCapital = t(
  'registration.passwordOneCapital',
  'Wachtwoord heeft tenminste een hoofdletter'
)

const tPasswordOneNumber = t(
  'registration.passwordOneNumber',
  'Wachtwoord heeft tenminste een cijfer'
)

const tConsentRequired = t(
  'registration.consentRequired',
  'U moet met de voorwaarden akkoord gaan'
)
