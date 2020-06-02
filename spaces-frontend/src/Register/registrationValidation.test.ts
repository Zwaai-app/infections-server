import * as V from './registrationValidation'
import { registrationDataEq } from './registerSlice'
import { getTupleEq, eqString } from 'fp-ts/lib/Eq'
import { replicate } from 'fp-ts/lib/Array'

it('validates email addresses', () => {
  expect(V.emailValid('')).toBeLeft(V.tInvalidEmail)
  expect(V.emailValid('foo')).toBeLeft(V.tInvalidEmail)
  expect(V.emailValid('foo@bar.com')).toBeRight('foo@bar.com')
})

it('validates phone numbers', () => {
  expect(V.phoneValid('')).toBeLeft(V.tInvalidPhone)
  expect(V.phoneValid('123')).toBeLeft(V.tInvalidPhone)
  expect(V.phoneValid('12345678')).toBeRight('12345678')
})

it('validates consent', () => {
  expect(V.consentValid(false)).toBeLeft(V.tConsentRequired)
  expect(V.consentValid(true)).toBeRight(true)
})

describe('password validation', () => {
  it('validates equal passwords', () => {
    expect(V.equalPasswords('p1', 'p2')).toBeLeft(V.tPasswordsDiffer)
    expect(V.equalPasswords('abc', 'abc')).toBeRight('abc')
  })

  it('validates minimum length', () => {
    expect(V.minPasswordLengthValidator('1234567')).toBeLeft(V.tPasswordLength)
    expect(V.minPasswordLengthValidator('12345678')).toBeRight('12345678')
  })

  it('validates one capital', () => {
    expect(V.oneCapitalValidator('aa')).toBeLeft(V.tPasswordOneCapital)
    expect(V.oneCapitalValidator('aA')).toBeRight('aA')
  })

  it('validates one number', () => {
    expect(V.oneNumberValidator('a')).toBeLeft(V.tPasswordOneNumber)
    expect(V.oneNumberValidator('a1')).toBeRight('a1')
  })
})

it('validates an invalid password', () => {
  expect(V.passwordValid('', 'a')).toBeLeft(
    [
      V.tPasswordLength,
      V.tPasswordOneCapital,
      V.tPasswordOneNumber,
      V.tPasswordsDiffer
    ],
    getTupleEq(...replicate(4, eqString))
  )
})

it('validates a correct password', () => {
  expect(V.passwordValid('Welcome123', 'Welcome123')).toBeRight('Welcome123')
})

it('validates incorrect registration data', () => {
  expect(
    V.validateRegistrationData('email', 'phone', 'pwd-one', 'pwd-two', false)
  ).toBeLeft(
    [
      V.tInvalidEmail,
      V.tInvalidPhone,
      V.tPasswordLength,
      V.tPasswordOneCapital,
      V.tPasswordOneNumber,
      V.tPasswordsDiffer,
      V.tConsentRequired
    ],
    getTupleEq(...replicate(7, eqString))
  )
})

it('validates correct registration data', () => {
  expect(
    V.validateRegistrationData(
      'foo@bar.com',
      '12345678',
      'Welcome123',
      'Welcome123',
      true
    )
  ).toBeRight(
    {
      email: 'foo@bar.com',
      phone: '12345678',
      password: 'Welcome123',
      consented: true
    },
    registrationDataEq
  )
})
