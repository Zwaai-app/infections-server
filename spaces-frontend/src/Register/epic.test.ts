import { epic, PostSignupFn } from './epic'
import { TestScheduler } from 'rxjs/testing'
import { setRegistrationData, signupSucceeded } from './registerSlice'
import { RootState } from '../rootReducer'
import { StateObservable } from 'redux-observable'
import store from '../store'
import { Subject } from 'rxjs'

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected)
})

const initialStateObservable = () =>
  new StateObservable<RootState>(new Subject(), store.getState())

const validRegistrationDataAction = setRegistrationData({
  email: 'foo@bar.com',
  phone: '12345678',
  password: 'Welcome123',
  consented: true
})

describe('Register epic', () => {
  test('happy path', () => {
    const actionToTest = validRegistrationDataAction
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const state$ = initialStateObservable()
      const action$ = hot('-a', { a: actionToTest }) as any
      const postSignupSpy: PostSignupFn = () => cold('--a', { a: 'response' })
      const output$ = epic(action$, state$, { postSignupFn: postSignupSpy })
      expectObservable(output$).toBe('---a', { a: signupSucceeded('response') })
    })
  })
})
