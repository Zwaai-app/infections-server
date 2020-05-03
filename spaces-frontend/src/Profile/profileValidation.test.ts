import {
  validOrganizationName,
  validPhone,
  validUrl,
  validateProfile,
  tInvalidOrgName,
  tInvalidUrl,
  tInvalidPhone,
  tInvalidLogo,
  tInvalidScheme
} from './profileValidation'
import * as E from 'fp-ts/lib/Either'

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

it('validates profile data', () => {
  const result = validateProfile('a', 'ftp://example.com', '', '')
  E.mapLeft(errs => {
    expect(errs).toContain(tInvalidOrgName)
    expect(errs).toContain(tInvalidScheme)
    expect(errs).toContain(tInvalidPhone)
    expect(errs).toContain(tInvalidLogo)
  })(result)
})
