import { pipe } from 'fp-ts/lib/pipeable'
import { Either, mapLeft } from 'fp-ts/lib/Either'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'

export function lift<E, A>(
  check: (a: A) => Either<E, A>
): (a: A) => Either<NonEmptyArray<E>, A> {
  return (a) =>
    pipe(
      check(a),
      mapLeft((a) => [a])
    )
}

export function lift2<E, A>(
  check: (a: A, b: A) => Either<E, A>
): (a: A, b: A) => Either<NonEmptyArray<E>, A> {
  return (a, b) =>
    pipe(
      check(a, b),
      mapLeft((a) => [a])
    )
}
