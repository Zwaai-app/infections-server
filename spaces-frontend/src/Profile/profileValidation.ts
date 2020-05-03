import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { parseURL, URLRecord } from 'whatwg-url'
import { parsePhoneNumberFromString, PhoneNumber } from 'libphonenumber-js'
import { t } from '../i18n'
import { constant, flow } from 'fp-ts/lib/function'
import { curry } from 'rambda'
import { NonEmptyArray, getSemigroup } from 'fp-ts/lib/NonEmptyArray'
import { ProfileData } from './profileSlice'
import { sequenceS } from 'fp-ts/lib/Apply'
import { lift } from '../EitherUtils'

export const tInvalidOrgName = t(
  'profile.invalidOrganizationName',
  'Organisatienaam moet minstens twee letters bevatten'
)
export const tInvalidUrl = t('profile.invalidUrl', 'Ongeldige URL')
export const tInvalidPhone = t(
  'profile.invalidPhone',
  'Ongeldig telefoonnummer'
)
export const tInvalidLogo = t('profile.invalidLogo', 'Ongeldig logo')

const minLength = curry((minLength: number, s: string) => s.length >= minLength)

export const validOrganizationName = (name: string): E.Either<string, string> =>
  E.fromPredicate(minLength(2), constant(tInvalidOrgName))(name)

const validScheme = (url: URLRecord): boolean =>
  !!url && (url.scheme === 'http' || url.scheme === 'https')

export const validUrl: (url: string) => E.Either<string, URLRecord> = flow(
  parseURL,
  O.fromNullable,
  O.filter(validScheme),
  E.fromOption(constant(tInvalidUrl))
)

export const validPhone = (phone: string): E.Either<string, PhoneNumber> =>
  E.fromNullable(tInvalidPhone)(parsePhoneNumberFromString(phone, 'NL'))

export const validLogo = (logo: string): E.Either<string, string> =>
  E.fromPredicate(minLength(5), constant(tInvalidLogo))(logo)

const applicativeValidation = () => E.getValidation(getSemigroup<string>())

export function validateProfile (
  organizationName: string,
  organizationUrl: string,
  phone: string,
  logo: string
): E.Either<NonEmptyArray<string>, ProfileData> {
  return sequenceS(applicativeValidation())({
    organizationName: lift(validOrganizationName)(organizationName),
    organizationUrl: lift(validUrl)(organizationUrl),
    phone: lift(validPhone)(phone),
    logo: lift(validLogo)(logo)
  })
}
