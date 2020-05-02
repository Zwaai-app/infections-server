import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { parseURL, URLRecord } from 'whatwg-url'
import { t } from '../i18n'
import { parsePhoneNumberFromString, PhoneNumber } from 'libphonenumber-js'
import { constant, flow } from 'fp-ts/lib/function'
import { curry } from 'rambda'

const tInvalidOrgName = t(
  'profile.invalidOrganizationName',
  'Organisatienaam moet minstens twee letters bevatten'
)
const tInvalidUrl = t('profile.invalidUrl', 'Ongeldige URL')
const tInvalidPhone = t('profile.invalidPhone', 'Ongeldig telefoonnummer')

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
