import * as V from './registrationValidation'
import { registrationDataEq } from './registerSlice'
import { getTupleEq, eqString } from 'fp-ts/lib/Eq'
import { replicate } from 'fp-ts/lib/Array'

it('validates email addresses', () => {
  expect(V.emailValidator('foo')).toBeLeft(V.tInvalidEmail)
  expect(V.emailValidator('foo@bar.com')).toBeRight('foo@bar.com')
})

it('validates phone numbers', () => {
  expect(V.phoneValidator('')).toBeLeft(V.tInvalidPhone)
  expect(V.phoneValidator('123')).toBeLeft(V.tInvalidPhone)
  expect(V.phoneValidator('12345678')).toBeRight('12345678')
  expect(V.phoneValidator('123456789')).toBeLeft(V.tInvalidPhone)
})

it('validates consent', () => {
  expect(V.consentValidator(false)).toBeLeft(V.tConsentRequired)
  expect(V.consentValidator(true)).toBeRight(true)
})

describe('password validation', () => {
  it('validates equal passwords', () => {
    expect(V.equalPasswordsValidator('p1', 'p2')).toBeLeft(V.tPasswordsDiffer)
    expect(V.equalPasswordsValidator('abc', 'abc')).toBeRight('abc')
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
  expect(V.passwordValidator('', 'a')).toBeLeft(
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
  expect(V.passwordValidator('Welcome123', 'Welcome123')).toBeRight(
    'Welcome123'
  )
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
