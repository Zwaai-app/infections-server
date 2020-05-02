import {
  validOrganizationName,
  validPhone,
  validUrl
} from './profileValidation'

it('validates organization names', () => {
  expect(validOrganizationName('')).toBeLeft()
  expect(validOrganizationName('f')).toBeLeft()
  expect(validOrganizationName('fo')).toBeRight('fo')
})

it('validates URLs', () => {
  expect(validUrl('http')).toBeLeft()
  expect(validUrl('http://')).toBeLeft()
  expect(validUrl('http://example.com')).toBeRight('')
  expect(validUrl('https://example.com')).toBeRight('')
  expect(validUrl('ftp://example.com')).toBeLeft()
})

it('validates phone numbers', () => {
  expect(validPhone('A')).toBeLeft()
  expect(validPhone('A1')).toBeLeft()
  expect(validPhone('012-3456789')).toBeRight()
})
