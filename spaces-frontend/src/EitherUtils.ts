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

export function lift2<E, A, B> (
  check: (a1: A, a2: A) => Either<E, B>
): (a1: A, a2: A) => Either<NonEmptyArray<E>, B> {
  return (a1, a2) =>
    pipe(
      check(a1, a2),
      mapLeft(e => [e])
    )
}
