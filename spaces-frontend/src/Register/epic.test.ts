import { epic, PostSignupFn } from './epic'
import { TestScheduler } from 'rxjs/testing'
import {
  setRegistrationData,
  signupSucceeded,
  signupFailed
} from './registerSlice'
import { RootState } from '../rootReducer'
import { StateObservable } from 'redux-observable'
import store from '../store'
import { Subject, throwError } from 'rxjs'

const deepEqual = (actual: any, expected: any) => {
  expect(actual).toEqual(expected)
}

const initialStateObservable = () =>
  new StateObservable<RootState>(new Subject(), store.getState())

const validRegistrationDataAction = setRegistrationData({
  email: 'foo@bar.com',
  phone: '12345678',
  password: 'Welcome123',
  consented: true
})

describe('Register epic', () => {
  let testScheduler: TestScheduler

  beforeEach(() => {
    testScheduler = new TestScheduler(deepEqual)
  })

  test('happy path', () => {
    const actionToTest = validRegistrationDataAction
    const response = 'some response'
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const state$ = initialStateObservable()
      const action$ = hot('-i', { i: actionToTest }) as any
      const postSignupSpy: PostSignupFn = () => cold('--r', { r: { response } })
      const output$ = epic(action$, state$, { postSignupFn: postSignupSpy })
      expectObservable(output$).toBe('---o', { o: signupSucceeded(response) })
    })
  })

  test('server returns error', () => {
    const errors = [{ value: 'bar', msg: 'Email is not valid', param: 'email' }]
    const error = new MockError('test error', errors)
    testScheduler.run(({ hot, expectObservable }) => {
      const postSignup = () => throwError(error)
      const state$ = initialStateObservable()
      const action$ = hot('-i', { i: validRegistrationDataAction }) as any
      const output$ = epic(action$, state$, { postSignupFn: postSignup })
      expectObservable(output$).toBe('-o', {
        o: signupFailed({ message: error.message, errors })
      })
    })
  })
})

class MockError extends Error {
  response: any

  constructor (message: string, errors: any[]) {
    super(message)
    this.response = { errors }
  }
}
