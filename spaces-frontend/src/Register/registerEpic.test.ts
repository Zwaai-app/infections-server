import { signupEpic } from './registerEpic'
import {
  setRegistrationData,
  signupSucceeded,
  signupFailed
} from './registerSlice'
import { ActionsObservable } from 'redux-observable'
import { throwError, of } from 'rxjs'
import { MockAjaxError } from '../testUtils/MockAjaxError'
import { initialStateObservable } from '../testUtils/stateObservable'

const validRegistrationDataAction = setRegistrationData({
  email: 'foo@bar.com',
  phone: '12345678',
  password: 'Welcome123',
  consented: true
})

describe('Register epic', () => {
  test('happy path', done => {
    expect.assertions(1)
    const response = 'some response'
    const postSignupFn = () => of({ response })
    const action$ = ActionsObservable.of(validRegistrationDataAction)
    const state$ = initialStateObservable()
    signupEpic(action$, state$, { postSignupFn }).subscribe(action => {
      expect(action).toEqual(signupSucceeded(response))
      done()
    })
  })

  test('server returns error', done => {
    expect.assertions(1)
    const errors = [{ value: 'bar', msg: 'Email is not valid', param: 'email' }]
    const error = new MockAjaxError('test error', errors)
    const postSignupFn = () => throwError(error)
    const action$ = ActionsObservable.of(validRegistrationDataAction)
    const state$ = initialStateObservable()
    signupEpic(action$, state$, { postSignupFn }).subscribe(action => {
      expect(action).toEqual(signupFailed({ message: error.message, errors }))
      done()
    })
  })
})
