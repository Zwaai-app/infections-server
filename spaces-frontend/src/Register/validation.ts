import { Either, left, right, map, getValidation } from 'fp-ts/lib/Either'
import { t } from '../i18n'
import { lift, lift2 } from '../EitherUtils'
import { sequenceT } from 'fp-ts/lib/Apply'
import { pipe } from 'fp-ts/lib/pipeable'
import { NonEmptyArray, getSemigroup } from 'fp-ts/lib/NonEmptyArray'

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

const minLengthV = lift(minLength)
const oneCapitalV = lift(oneCapital)
const oneNumberV = lift(oneNumber)
const equalPasswordsV = lift2(equalPasswords)

export function validatePassword(
  p1: string,
  p2: string
): Either<NonEmptyArray<string>, string[]> {
  return pipe(
    sequenceT(getValidation(getSemigroup<string>()))(
      minLengthV(p1),
      oneCapitalV(p1),
      oneNumberV(p1),
      equalPasswordsV(p1, p2)
    ),
    map(() => [])
  )
}

const tPasswordsDiffer = t(
  'registration.passwordsDiffer',
  'Wachtwoorden zijn niet hetzelfde'
)

const tPasswordLength = t(
  'registration.passwordMinimalLength',
  'tenminste 8 karakters'
)

const tPasswordOneCapital = t(
  'registration.passwordOneCapital',
  'tenminste een hoofdletter'
)

const tPasswordOneNumber = t(
  'registration.passwordOneNumber',
  'tenminste een cijfer'
)
