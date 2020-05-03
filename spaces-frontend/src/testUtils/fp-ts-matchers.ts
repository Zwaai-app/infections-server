import * as E from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import diff from 'jest-diff'
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeLeft(value?: any): R
      toBeRight(value?: any): R
    }
  }
}

expect.extend({
  toBeLeft<E, A> (received: E.Either<E, A>, expected?: E) {
    return {
      pass: expected
        ? E.exists(v => v === expected)(E.swap(received))
        : E.isLeft(received),
      message: () => {
        if (!expected) {
          return `Either expected to be left, but was right`
        } else {
          return determineDiff(
            { expand: !!this.expand },
            expected
          )(E.swap(received))
        }
      }
    }
  },
  toBeRight<E, A> (received: E.Either<E, A>, expected?: A) {
    return {
      pass: expected
        ? E.exists(v => v === expected)(received)
        : E.isRight(received),
      message: () => {
        if (!expected) {
          return 'Either expected to be right, but was left'
        } else {
          return determineDiff({ expand: !!this.expand }, expected)(received)
        }
      }
    }
  }
})

function determineDiff<A, B> (options: any, expected: B) {
  return (received: E.Either<A, B>) =>
    flow(
      E.map(v => {
        const diffString = diff(expected, v, options)
        return (
          matcherHint('toBeRight', undefined, undefined) +
          '\n\n' +
          (diffString && diffString.includes('- Expect')
            ? `Difference:\n\n${diffString}`
            : `Expected: right(${printExpected(expected)})\n` +
              `Received: right(${printReceived(received)})`)
        )
      }),
      E.getOrElse(() => `Either expected to be right, but was left`)
    )(received)
}
