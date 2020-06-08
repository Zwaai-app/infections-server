import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'
import diff from 'jest-diff'
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils'
import { Eq, eqStrict } from 'fp-ts/lib/Eq'
import { Foldable, Foldable1, Foldable2 } from 'fp-ts/lib/Foldable'
import { HKT, URIS, Kind, Kind2, URIS2 } from 'fp-ts/lib/HKT'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeNone(value?: any, eq?: Eq<any>): R
      toBeSome(value?: any, eq?: Eq<any>): R
      toBeLeft(value?: any, eq?: Eq<any>): R
      toBeRight(value?: any, eq?: Eq<any>): R
    }
  }
}

/**
 * This matcher allows you to expect that an `Option` is `none`.
 *
 * @param received the option that is expected to be `none`
 *
 * @see https://gcanti.github.io/fp-ts/modules/Option.ts.html
 */
export const toBeNoneMatcher = <A>(received: O.Option<A>) => {
  return {
    pass: O.isNone(received),
    message: () => 'Option expected to be none, but was some'
  }
}

/**
 * This matcher allows you to expect that an `Option` is `some`, optionally
 * with the expected value of the `some` and an `Eq` instance that should be
 * used for checking the value.
 *
 * @param received the option that is expected to be `some`
 * @param expected optionally, the expected value of the `some`
 * @param eq optionally, an `Eq` instance for checking the value; if absent,
 *           `eqStrict` is used, which corresponds to checking with `===`.
 *
 * @see https://gcanti.github.io/fp-ts/modules/Option.ts.html
 * @see https://gcanti.github.io/fp-ts/modules/Eq.ts.html
 */
export const toBeSomeMatcher = <A>(
  expand: boolean,
  received: O.Option<A>,
  expected?: A,
  eq: Eq<A> = eqStrict
) => {
  return {
    pass: expected ? O.elem(eq)(expected, received) : O.isSome(received),
    message: () => {
      if (!expected) {
        return 'Option expected to be some, but was none'
      } else {
        return determineDiff_Option({ expand }, expected)(received)
      }
    }
  }
}

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
export const toBeLeftMatcher = <E, A>(
  expand: boolean,
  received: E.Either<E, A>,
  expected?: E,
  eq: Eq<E> = eqStrict
) => {
  return {
    pass: expected
      ? E.elem(eq)(expected, E.swap(received))
      : E.isLeft(received),
    message: () => {
      if (!expected) {
        return `Either expected to be left, but was right`
      } else {
        return determineDiff_Either({ expand }, expected)(E.swap(received))
      }
    }
  }
}

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
export const toBeRightMatcher = <E, A>(
  expand: boolean,
  received: E.Either<E, A>,
  expected?: A,
  eq?: Eq<A>
) => {
  let equals = eq || eqStrict
  return {
    pass: expected ? E.elem(equals)(expected, received) : E.isRight(received),
    message: () => {
      if (!expected) {
        return 'Either expected to be right, but was left'
      } else {
        return determineDiff_Either({ expand }, expected)(received)
      }
    }
  }
}

function determineDiff_Option<A> (
  options: any,
  expected: A
): (received: O.Option<A>) => string {
  return determineDiff_HKT(
    O.option,
    `Option expected to be some, but was none`,
    'toBeSome',
    'some'
  )(options, expected)
}

function determineDiff_Either<A> (options: any, expected: A) {
  return determineDiff_HKT(
    E.either,
    `Either expected to be right, but was left`,
    'toBeRight',
    'right'
  )(options, expected)
}

function determineDiff_HKT<F extends URIS> (
  F: Foldable1<F>,
  messageWithoutDetails: string,
  matcherName: string,
  constructorLabel: string
): <A>(options: any, expected: A) => (received: Kind<F, A>) => string
function determineDiff_HKT<F extends URIS2> (
  F: Foldable2<F>,
  messageWithoutDetails: string,
  matcherName: string,
  constructorLabel: string
): <E, A>(options: any, expected: A) => (received: Kind2<F, E, A>) => string
function determineDiff_HKT<F> (
  F: Foldable<F>,
  messageWithoutDetails: string,
  matcherName: string,
  constructorLabel: string
): <A>(options: any, expected: A) => (received: HKT<F, A>) => string {
  return <A>(options: any, expected: A) => (received: HKT<F, A>) =>
    F.reduce(received, messageWithoutDetails, (_, a) =>
      formattedDiffMessage(options, matcherName, constructorLabel, expected)(a)
    )
}

const formattedDiffMessage = <B>(
  options: any,
  hintLabel: string,
  wrapper: string,
  expected: B
) => (received: B) => {
  const diffString = diff(expected, received, options)
  return (
    matcherHint(hintLabel, undefined, undefined) +
    '\n\n' +
    (diffString && diffString.includes('- Expect')
      ? `Difference:\n\n${diffString}`
      : `Expected: ${wrapper}(${printExpected(expected)})\n` +
        `Received: ${wrapper}(${printReceived(received)})`)
  )
}

expect.extend({
  toBeNone: toBeNoneMatcher,
  toBeSome<A> (received: O.Option<A>, expected?: A, eq: Eq<A> = eqStrict) {
    return toBeSomeMatcher(!!this.expand, received, expected, eq)
  },
  toBeLeft<E, A> (
    received: E.Either<E, A>,
    expected?: E,
    eq: Eq<E> = eqStrict
  ) {
    return toBeLeftMatcher(!!this.expand, received, expected, eq)
  },
  toBeRight<E, A> (received: E.Either<E, A>, expected?: A, eq?: Eq<A>) {
    return toBeRightMatcher(!!this.expand, received, expected, eq)
  }
})
