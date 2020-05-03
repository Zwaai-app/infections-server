import {
  validOrganizationName,
  validPhone,
  validUrl,
  validateProfile,
  tInvalidOrgName,
  tInvalidUrl,
  tInvalidPhone,
  tInvalidLogo,
  tInvalidScheme,
  validLogo,
  tLogoTooLarge
} from './profileValidation'
import * as E from 'fp-ts/lib/Either'
import { buffer } from 'rxjs/operators'

it('validates organization names', () => {
  expect(validOrganizationName('')).toBeLeft()
  expect(validOrganizationName('f')).toBeLeft()
  expect(validOrganizationName('fo')).toBeRight('fo')
})

it('validates URLs', () => {
  expect(validUrl('http')).toBeLeft(tInvalidUrl)
  expect(validUrl('http://')).toBeLeft(tInvalidUrl)
  expect(validUrl('http://example.com')).toBeRight('')
  expect(validUrl('https://example.com')).toBeRight('')
  expect(validUrl('ftp://example.com')).toBeLeft(tInvalidScheme)
})

it('validates phone numbers', () => {
  expect(validPhone('A')).toBeLeft()
  expect(validPhone('A1')).toBeLeft()
  expect(validPhone('012-3456789')).toBeRight()
})

it('validates logo', () => {
  const largeString = new String(Buffer.alloc(101e3, 'a')).toString()
  expect(validLogo('logo')).toBeLeft(tInvalidLogo)
  expect(validLogo('data:image/png;base64:ABC')).toBeRight()
  expect(
    validLogo('data:image/png;base64:' + window.btoa(largeString))
  ).toBeLeft(tLogoTooLarge)
})

it('validates profile data', () => {
  const result = validateProfile('a', 'ftp://example.com', '', '')
  E.mapLeft(errs => {
    expect(errs).toContain(tInvalidOrgName)
    expect(errs).toContain(tInvalidScheme)
    expect(errs).toContain(tInvalidPhone)
    expect(errs).toContain(tInvalidLogo)
  })(result)
})
