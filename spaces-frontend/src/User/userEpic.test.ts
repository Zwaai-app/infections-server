import { loginEpic } from './userEpic'
import { ActionsObservable, StateObservable } from 'redux-observable'
import {
  login,
  loginSucceeded,
  LoginSucceededAction,
  loginFailed,
  logout
} from './userSlice'
import { RootState } from '../rootReducer'
import { Subject, of, throwError } from 'rxjs'
import store from '../store'
import { MockAjaxError } from '../testUtils/MockAjaxError'
import { initialStateObservable } from '../testUtils/stateObservable'

const loginAction = login({ username: 'foo@example.com', password: 'bar' })

it('performs login successfully', done => {
  expect.assertions(1)
  const action$ = ActionsObservable.of(loginAction)
  const state$ = initialStateObservable()
  const token = 'some token'
  const postLoginFn = () => of({ response: {} })
  loginEpic(action$, state$, { postLoginFn }).subscribe(action => {
    expect(action).toEqual(loginSucceeded())
    done()
  })
})

it('handles failing login', done => {
  expect.assertions(1)
  const action$ = ActionsObservable.of(loginAction)
  const state$ = initialStateObservable()
  const error = new MockAjaxError('invalid username or password', [])
  const postLoginFn = () => throwError(error)
  loginEpic(action$, state$, { postLoginFn }).subscribe(action => {
    expect(action).toEqual(loginFailed(error.message))
    done()
  })
})

it('handles logout even when it throws', async () => {
  expect.assertions(1)
  const action$ = ActionsObservable.of(logout())
  const state$ = initialStateObservable()
  const error = new MockAjaxError('some server error', [])
  const postLoginFn = () => throwError(error)
  await expect(
    loginEpic(action$, state$, { postLoginFn }).toPromise()
  ).resolves.toBeUndefined()
})
