import { PayloadAction } from '@reduxjs/toolkit'

/**
 * Given an action creator function, this gives the type of
 * the payload parameter of that action creator.
 *
 * See unit test for an example.
 */
export type PayloadParameterType<
  T extends (...args: any) => PayloadAction<any>
> = T extends (...args: infer U) => any ? U[0] : never

/**
 * Given a payload action, this gives the type of the payload.
 *
 * See unit test for an example.
 */
export type PayloadType<A extends PayloadAction<any>> = A extends {
  payload: infer P
}
  ? P
  : never
