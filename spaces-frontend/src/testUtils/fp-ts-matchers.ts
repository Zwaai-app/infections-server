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
  toBeLeft<E, A> (received: E.Either<E, A>) {
    return {
      pass: E.isLeft(received),
      message: () => `Either expected to be left, but was right`
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
          return flow(
            E.map(v => {
              const diffString = diff(expected, v, { expand: !!this.expand })
              return (
                matcherHint('toBeRight', undefined, undefined) +
                '\n\n' +
                (diffString && diffString.includes('- Expect')
                  ? `Difference:\n\n${diffString}`
                  : `Expected: right(${printExpected(expected)})\n` +
                    `Received: right(${printReceived(received)})`)
              )

              // `Either expected to be ${value}, but was ${v}`
            }),
            E.getOrElse(() => `Either expected to be right, but was left`)
          )(received)
        }
      }
    }
  }
})
