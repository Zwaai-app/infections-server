import { pipe } from 'fp-ts/lib/pipeable'
import { Either, mapLeft } from 'fp-ts/lib/Either'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'

/**
 * Lifts the error of a validation function into a (non-empty) array.
 * This way multiple validation functions can be composed while appending
 * their errors to the array. This variant is for a validation function
 * with one parameter.
 *
 * lift :: ( a -> Either e,b ) -> ( a -> Either [e], b )
 *
 * @param check single-arg (validation) function of which the error is lifted
 * @see lift2
 */
export function lift<E, A, B> (
  check: (a: A) => Either<E, B>
): (a: A) => Either<NonEmptyArray<E>, B> {
  return a =>
    pipe(
      check(a),
      mapLeft(e => [e])
    )
}

/**
 * Lifts the error of a validation function into a (non-empty) array.
 * This way multiple validation functions can be composed while appending
 * their errors to the array. This variant is for a validation function
 * with two parameters.
 *
 * lift :: ( a -> b -> Either e,c ) -> ( a -> b -> Either [e], c )
 *
 * @param check double-arg (validation) function of which the error is lifted
 * @see lift
 */
export function lift2<E, A, B, C> (
  check: (a: A, b: B) => Either<E, C>
): (a: A, b: B) => Either<NonEmptyArray<E>, C> {
  return (a, b) =>
    pipe(
      check(a, b),
      mapLeft(e => [e])
    )
}
