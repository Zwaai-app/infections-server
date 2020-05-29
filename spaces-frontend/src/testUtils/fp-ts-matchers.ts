import * as E from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import diff from 'jest-diff'
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils'
import { Eq, eqStrict } from 'fp-ts/lib/Eq'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeLeft(value?: any, eq?: Eq<any>): R
      toBeRight(value?: any, eq?: Eq<any>): R
    }
  }
}

expect.extend({
  /**
   * This matcher allows you to expect that an `Either` is a `left`, optionally
   * with the expected value of the `left` and an `Eq` instance that should be
   * used for checking the value.
   *
   * @param received the either that is expected to be `left`
   * @param expected optionally, the expected value of the `left`
   * @param eq optionally, an `Eq` instance for checking the value; if absent,
   *           `eqStrict` is used, which corresponds to checking with `===`.
   *
   * @see https://gcanti.github.io/fp-ts/modules/Either.ts.html
   * @see https://gcanti.github.io/fp-ts/modules/Eq.ts.html
   */
  toBeLeft<E, A> (
    received: E.Either<E, A>,
    expected?: E,
    eq: Eq<E> = eqStrict
  ) {
    return {
      pass: expected
        ? E.elem(eq)(expected, E.swap(received))
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
  /**
   * This matcher allows you to expect that an `Either` is a `right`, optionally
   * with the expected value of the `right` and an `Eq` instance that should be
   * used for checking the value.
   *
   * @param received the either that is expected to be `right`
   * @param expected optionally, the expected value of the `right`
   * @param eq optionally, an `Eq` instance for checking the value; if absent,
   *           `eqStrict` is used, which corresponds to checking with `===`.
   *
   * @see https://gcanti.github.io/fp-ts/modules/Either.ts.html
   * @see https://gcanti.github.io/fp-ts/modules/Eq.ts.html
   */
  toBeRight<E, A> (received: E.Either<E, A>, expected?: A, eq?: Eq<A>) {
    let equals = eq || eqStrict
    return {
      pass: expected ? E.elem(equals)(expected, received) : E.isRight(received),
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
