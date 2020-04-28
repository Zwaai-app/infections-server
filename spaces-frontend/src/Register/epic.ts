import { map, flatMap, catchError } from 'rxjs/operators'
import { ajax, AjaxError } from 'rxjs/ajax'
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

const postSignup: PostSignupFn = action => {
  return ajax({
    url: 'http://localhost:3000/api/v1/signup',
    method: 'POST',
    crossDomain: true,
    body: {
      email: action.payload.email,
      password: action.payload.password,
      confirmPassword: action.payload.password
    }
  }).pipe(map(r => r.response))
}

const success = (response: any) => signupSucceeded(response)

const failed = (error: AjaxError) =>
  of(
    signupFailed({
      message: error.message,
      errors: error.response.errors
    })
  )

export const epic: Epic<Actions, Actions, RootState> = (
  action$,
  _state$,
  { postSignupFn = postSignup }: { postSignupFn: PostSignupFn }
) =>
  action$.pipe(
    ofType<Actions, SetRegistrationDataAction>(setRegistrationData.type),
    flatMap(action =>
      postSignupFn(action).pipe(map(success), catchError(failed))
    )
  )
