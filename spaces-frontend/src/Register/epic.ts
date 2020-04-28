import { map, flatMap, filter, catchError } from 'rxjs/operators'
import { ajax, AjaxError, AjaxResponse } from 'rxjs/ajax'
import { of, Observable } from 'rxjs'
import { Epic } from 'redux-observable'
import { ActionType } from 'typesafe-actions'
import {
  setRegistrationData,
  signupFailed,
  signupSucceeded,
  RegistrationData
} from './registerSlice'
import { RootState } from '../rootReducer'
import { PayloadAction } from '@reduxjs/toolkit'

export type Actions = ActionType<
  typeof setRegistrationData | typeof signupSucceeded | typeof signupFailed
>

function postSignup (
  action: PayloadAction<RegistrationData>
): Observable<AjaxResponse> {
  return ajax({
    url: 'http://localhost:3000/api/v1/signup',
    method: 'POST',
    crossDomain: true,
    body: {
      email: action.payload.email,
      password: action.payload.password,
      confirmPassword: action.payload.password
    }
  })
}

const success = (ajaxResponse: AjaxResponse) =>
  signupSucceeded(ajaxResponse.response)

const failed = (error: AjaxError) =>
  of(
    signupFailed({
      message: error.message,
      errors: error.response.errors
    })
  )

export const epic: Epic<Actions, Actions, RootState> = action$ =>
  action$.pipe(
    filter(setRegistrationData.match),
    flatMap(action => postSignup(action).pipe(map(success), catchError(failed)))
  )
