import { pipe } from 'fp-ts/lib/pipeable'
import { Either, mapLeft } from 'fp-ts/lib/Either'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'

export function lift<E, A, B> (
  check: (a: A) => Either<E, B>
): (a: A) => Either<NonEmptyArray<E>, B> {
  return a =>
    pipe(
      check(a),
      mapLeft(e => [e])
    )
}

export function lift2<E, A, B, C> (
  check: (a: A, b: B) => Either<E, C>
): (a: A, b: B) => Either<NonEmptyArray<E>, C> {
  return (a, b) =>
    pipe(
      check(a, b),
      mapLeft(e => [e])
    )
}
