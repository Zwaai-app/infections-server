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
import { getTupleEq, eqString } from 'fp-ts/lib/Eq'
import { replicate } from 'fp-ts/lib/Array'

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
  expect(validPhone('+316123')).toBeLeft()
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
  expect(validateProfile('a', 'ftp://example.com', '', '')).toBeLeft(
    [tInvalidOrgName, tInvalidScheme, tInvalidPhone, tInvalidLogo],
    getTupleEq(...replicate(4, eqString))
  )
})
