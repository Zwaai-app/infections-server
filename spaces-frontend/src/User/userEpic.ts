import {
  login,
  LoginAction,
  LoginCredentials,
  loginSucceeded,
  loginFailed,
  logout,
  LogoutAction
} from './userSlice'
import { ActionType } from 'typesafe-actions'
import { Epic, ofType } from 'redux-observable'
import { RootState } from '../rootReducer'
import { flatMap, map, catchError, ignoreElements } from 'rxjs/operators'
import { ajax, AjaxResponse, AjaxError } from 'rxjs/ajax'
import { of, Observable } from 'rxjs'

export type Actions = ActionType<
  typeof login | typeof loginSucceeded | typeof loginFailed | typeof logout
>

type PostLoginFn = (creds: LoginCredentials) => Observable<any>

const postLogin: PostLoginFn = creds =>
  ajax({
    url: 'http://localhost:3000/api/v1/login',
    method: 'POST',
    crossDomain: true,
    responseType: 'json',
    body: { email: creds.username, password: creds.password }
  })

const success = (r: AjaxResponse) => loginSucceeded()
const failed = (e: AjaxError) => of(loginFailed(e.message))

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

type PostLogoutFn = () => Observable<any>
const postLogout: PostLogoutFn = () =>
  ajax({
    url: 'http://localhost:3000/api/v1/logout',
    method: 'POST',
    crossDomain: true,
    withCredentials: true,
    responseType: 'json'
  })
export const logoutEpic: Epic<Actions, Actions, RootState> = (
  action$,
  _state$,
  { postLogoutFn = postLogout }: { postLogoutFn?: PostLogoutFn } = {}
) =>
  action$.pipe(
    ofType<Actions, LogoutAction>(logout.type),
    flatMap(() => postLogoutFn().pipe(ignoreElements()))
  )

export const allEpics = [loginEpic, logoutEpic]
