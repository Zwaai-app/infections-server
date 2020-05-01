import {
  login,
  LoginAction,
  LoginCredentials,
  loginSucceeded,
  loginFailed
} from './userSlice'
import { ActionType } from 'typesafe-actions'
import { Epic, ofType } from 'redux-observable'
import { RootState } from '../rootReducer'
import { flatMap, map, catchError } from 'rxjs/operators'
import { ajax, AjaxResponse, AjaxError } from 'rxjs/ajax'
import { of, Observable } from 'rxjs'

export type Actions = ActionType<
  typeof login | typeof loginSucceeded | typeof loginFailed
>

type PostLoginFn = (creds: LoginCredentials) => Observable<any>

const postLogin: PostLoginFn = creds =>
  ajax({
    url: 'http://localhost:3000/api/v1/login',
    method: 'POST',
    crossDomain: true,
    body: { email: creds.username, password: creds.password }
  })

const success = (r: AjaxResponse) => loginSucceeded(r.response.token)
const failed = (e: AjaxError) => of(loginFailed(e))

export const loginEpic: Epic<Actions, Actions, RootState> = (
  action$,
  _state$,
  { postLoginFn = postLogin }: { postLoginFn?: PostLoginFn } = {}
) =>
  action$.pipe(
    ofType<Actions, LoginAction>(login.type),
    flatMap(action =>
      postLoginFn(action.payload).pipe(map(success), catchError(failed))
    )
  )
