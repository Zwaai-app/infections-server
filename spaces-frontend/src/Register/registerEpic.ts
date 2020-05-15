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
  signupStarted,
  SignupSucceededAction
} from './registerSlice'
import { RootState } from '../rootReducer'
import { login } from '../User/userSlice'

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

const success = (r: AjaxResponse, username: string, password: string) =>
  signupSucceeded({ response: r.response, username, password })
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

export const signupEpic: Epic<Actions, Actions, RootState> = (
  action$,
  _state$,
  { postSignupFn = postSignup }: EpicDeps = {}
) =>
  action$.pipe(
    ofType<Actions, SetRegistrationDataAction>(setRegistrationData.type),
    flatMap(action =>
      postSignupFn(action).pipe(
        map(response =>
          success(response, action.payload.email, action.payload.password)
        ),
        catchError(failed)
      )
    )
  )

export const autoLoginEpic: Epic<Actions, Actions, RootState> = (
  action$,
  _state$
) =>
  action$.pipe(
    ofType<Actions, SignupSucceededAction>(signupSucceeded.type),
    flatMap(action =>
      of(
        login({
          username: action.payload.username,
          password: action.payload.password
        })
      )
    )
  )

export const allEpics = [signupEpic, autoLoginEpic]
