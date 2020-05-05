import { loadProfileEpic, storeProfileEpic } from './profileEpic'
import { ActionsObservable } from 'redux-observable'
import {
  loadProfile,
  profileLoaded,
  profileLoadFailed,
  updateProfile,
  storeProfileSucceeded,
  storeProfileFailed
} from './profileSlice'
import { of, throwError } from 'rxjs'
import { initialStateObservable } from '../testUtils/stateObservable'
import { MockAjaxError } from '../testUtils/MockAjaxError'

const orgData = {
  organizationName: 'my org',
  organizationUrl: 'http://example.com',
  phone: '088-1234567',
  logo: 'data:image/png;base64,...'
}

it('can load a profile', done => {
  expect.assertions(1)
  const action$ = ActionsObservable.of(loadProfile())
  const state$ = initialStateObservable()
  const getProfileFn = () => of({ response: orgData })
  loadProfileEpic(action$, state$, { getProfileFn }).subscribe(action => {
    expect(action).toEqual(profileLoaded(orgData))
    done()
  })
})

it('reports load failures', done => {
  expect.assertions(1)
  const action$ = ActionsObservable.of(loadProfile())
  const state$ = initialStateObservable()
  const getProfileFn = () => throwError(new MockAjaxError('some error'))
  loadProfileEpic(action$, state$, { getProfileFn }).subscribe(action => {
    expect(action).toEqual(profileLoadFailed('some error'))
    done()
  })
})

it('can store a profile', done => {
  expect.assertions(1)
  const action$ = ActionsObservable.of(updateProfile(orgData))
  const state$ = initialStateObservable()
  const storeProfileFn = () => of({})
  storeProfileEpic(action$, state$, { storeProfileFn }).subscribe(action => {
    expect(action).toEqual(storeProfileSucceeded())
    done()
  })
})

it('reports store errors', done => {
  expect.assertions(1)
  const action$ = ActionsObservable.of(updateProfile(orgData))
  const state$ = initialStateObservable()
  const storeProfileFn = () => throwError(new MockAjaxError('some error'))
  storeProfileEpic(action$, state$, { storeProfileFn }).subscribe(action => {
    expect(action).toEqual(storeProfileFailed('some error'))
    done()
  })
})
