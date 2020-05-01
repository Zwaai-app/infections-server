import { map, flatMap, catchError } from 'rxjs/operators'
import { ajax, AjaxError, AjaxResponse } from 'rxjs/ajax'
import { of, Observable } from 'rxjs'
import { Epic, ofType } from 'redux-observable'
import { ActionType } from 'typesafe-actions'
import {
  setRegistrationData,
  signupFailed,
  signupSucceeded,
  SetRegistrationDataAction,
  signupStarted
} from './registerSlice'
import { RootState } from '../rootReducer'

export type Actions = ActionType<
  | typeof setRegistrationData
  | typeof signupSucceeded
  | typeof signupFailed
  | typeof signupStarted
>

export type PostSignupFn = (
  action: SetRegistrationDataAction
) => Observable<any>

const postSignup: PostSignupFn = action =>
  ajax({
    url: 'http://localhost:3000/api/v1/signup',
    method: 'POST',
    crossDomain: true,
    responseType: 'json',
    body: {
      email: action.payload.email,
      password: action.payload.password,
      confirmPassword: action.payload.password
    }
  })

const success = (r: AjaxResponse) => signupSucceeded(r.response)

const failed = (e: AjaxError) =>
  of(
    signupFailed({
      message: e.message,
      errors: e.response?.errors || []
    })
  )

interface EpicDeps {
  postSignupFn?: PostSignupFn
}

export const epic: Epic<Actions, Actions, RootState> = (
  action$,
  _state$,
  { postSignupFn = postSignup }: EpicDeps = {}
) =>
  action$.pipe(
    ofType<Actions, SetRegistrationDataAction>(setRegistrationData.type),
    flatMap(action =>
      postSignupFn(action).pipe(map(success), catchError(failed))
    )
  )
