import * as E from 'fp-ts/lib/Either'
import { parseURL, URLRecord } from 'whatwg-url'
import { parsePhoneNumberFromString, PhoneNumber } from 'libphonenumber-js'
import { t } from '../i18n'
import { constant, flow, flip } from 'fp-ts/lib/function'
import { curry } from 'rambda'
import { NonEmptyArray, getSemigroup } from 'fp-ts/lib/NonEmptyArray'
import { ProfileData } from './profileSlice'
import { sequenceS } from 'fp-ts/lib/Apply'
import { lift } from '../utils/lift'

export const tInvalidOrgName = t(
  'profile.invalidOrganizationName',
  'Organisatienaam moet minstens twee letters bevatten'
)
export const tInvalidUrl = t('profile.invalidUrl', 'Ongeldige URL')
export const tInvalidScheme = t(
  'profile.invalidScheme',
  'Alleen http en https zijn toegestaan'
)
export const tInvalidPhone = t(
  'profile.invalidPhone',
  'Ongeldig telefoonnummer'
)
export const tInvalidLogo = t('profile.invalidLogo', 'Ongeldig logo')
export const maxLogoSizeKB = 100
export const tLogoTooLarge = t(
  'profile.logoTooLarge',
  'Logo is te groot, maximaal {{maxSize}}KB',
  new Map([['maxSize', `${maxLogoSizeKB}`]])
)

const parseNLPhoneNr = curry(flip(parsePhoneNumberFromString))('NL')
const minLength = curry((minLength: number, s: string) => s.length >= minLength)
const maxLength = curry((maxLength: number, s: string) => s.length < maxLength)

export const validOrganizationName = (name: string): E.Either<string, string> =>
  E.fromPredicate(minLength(2), constant(tInvalidOrgName))(name)

const validScheme = (url: URLRecord): boolean =>
  !!url && (url.scheme === 'http' || url.scheme === 'https')

export const validUrl: (url: string) => E.Either<string, URLRecord> = flow(
  parseURL,
  E.fromNullable(tInvalidUrl),
  E.filterOrElse(validScheme, constant(tInvalidScheme))
)

export const validPhone: (
  phone: string
) => E.Either<string, PhoneNumber> = flow(
  parseNLPhoneNr,
  E.fromNullable(tInvalidPhone),
  E.filterOrElse(pn => pn.isValid(), constant(tInvalidPhone))
)

const base64factor = 4 / 3
export const validLogo = (logo: string): E.Either<string, string> =>
  flow(
    E.fromPredicate(minLength(5), constant(tInvalidLogo)),
    E.filterOrElse(
      maxLength(maxLogoSizeKB * 1e3 * base64factor),
      constant(tLogoTooLarge)
    )
  )(logo)

const applicativeValidation = () => E.getValidation(getSemigroup<string>())

export function validateProfile (
  organizationName: string,
  organizationUrl: string,
  phone: string,
  logo: string
): E.Either<NonEmptyArray<string>, ProfileData> {
  return sequenceS(applicativeValidation())({
    organizationName: lift(validOrganizationName)(organizationName),
    organizationUrl: E.map(constant(organizationUrl))(
      lift(validUrl)(organizationUrl)
    ),
    phone: E.map((pn: PhoneNumber) => pn.formatInternational())(
      lift(validPhone)(phone)
    ),
    logo: lift(validLogo)(logo)
  })
}
