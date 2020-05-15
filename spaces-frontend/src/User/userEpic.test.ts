import { loginEpic } from './userEpic'
import { ActionsObservable } from 'redux-observable'
import { login, loginSucceeded, loginFailed, logout } from './userSlice'
import { of, throwError } from 'rxjs'
import { MockAjaxError } from '../testUtils/MockAjaxError'
import { initialStateObservable } from '../testUtils/stateObservable'
import { loadProfile } from '../Profile/profileSlice'
import { Action } from 'redux'
import { loadSpaces } from '../Spaces/spacesSlice'

const loginAction = login({ username: 'foo@example.com', password: 'bar' })

it('performs login successfully', done => {
  expect.assertions(3)
  const action$ = ActionsObservable.of(loginAction)
  const state$ = initialStateObservable()
  const postLoginFn = () => of({ response: {} })
  let actions: Action[] = []
  loginEpic(action$, state$, { postLoginFn }).subscribe(action => {
    actions.push(action)
    if (actions.length === 3) {
      expect(actions[0]).toEqual(loginSucceeded())
      expect(actions[1]).toEqual(loadProfile())
      expect(actions[2]).toEqual(loadSpaces())
      done()
    }
  })
})

it('handles failing login', done => {
  expect.assertions(1)
  const action$ = ActionsObservable.of(loginAction)
  const state$ = initialStateObservable()
  const error = new MockAjaxError('invalid username or password')
  const postLoginFn = () => throwError(error)
  loginEpic(action$, state$, { postLoginFn }).subscribe(action => {
    expect(action).toEqual(loginFailed({ message: error.message }))
    done()
  })
})

it('handles logout even when it throws', async () => {
  expect.assertions(1)
  const action$ = ActionsObservable.of(logout())
  const state$ = initialStateObservable()
  const error = new MockAjaxError('some server error')
  const postLoginFn = () => throwError(error)
  await expect(
    loginEpic(action$, state$, { postLoginFn }).toPromise()
  ).resolves.toBeUndefined()
})
