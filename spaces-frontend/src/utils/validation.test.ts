import {
  oneCapital,
  oneNumber,
  minLength,
  maxLength,
  parseEmail,
  parsePhone
} from './validation'

it('validates at least one capital', () => {
  expect(oneCapital('aa')).toBeNone()
  expect(oneCapital('aA')).toBeSome('aA')
})

it('validates at least one number', () => {
  expect(oneNumber('')).toBeNone()
  expect(oneNumber('a')).toBeNone()
  expect(oneNumber('a1')).toBeSome('a1')
})

it('validates min length', () => {
  expect(minLength(3)('')).toBeNone()

  expect(minLength(3)('ab')).toBeNone()
  expect(minLength(2)('ab')).toBeSome('ab')

  expect(minLength(3)('abc')).toBeSome('abc')
})

it('validates max length', () => {
  expect(maxLength(2)('')).toBeSome('')

  expect(maxLength(2)('ab')).toBeSome('ab')
  expect(maxLength(2)('abc')).toBeNone()

  expect(maxLength(3)('abc')).toBeSome('abc')
})

it('validates email addresses', () => {
  expect(parseEmail('')).toBeNone()
  expect(parseEmail('foo')).toBeNone()
  expect(parseEmail('foo@bar.com')).toBeSome()
})

it('validates phone numbers', () => {
  expect(parsePhone('0')).toBeNone()
  expect(parsePhone('0123456789')).toBeSome()
  expect(parsePhone('+31 (0) 123 456789')).toBeSome()
})
