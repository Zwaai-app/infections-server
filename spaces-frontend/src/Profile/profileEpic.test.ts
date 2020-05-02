import { loadProfileEpic } from './profileEpic'
import { ActionsObservable, StateObservable } from 'redux-observable'
import { loadProfile, profileLoaded, profileLoadFailed } from './profileSlice'
import { RootState } from '../rootReducer'
import { Subject, of, throwError } from 'rxjs'
import store from '../store'
import { initialStateObservable } from '../testUtils/stateObservable'
import { MockAjaxError } from '../testUtils/MockAjaxError'

const orgData = {
  organizationName: 'my org',
  organizationUrl: 'http://example.com',
  phone: '088-1234567'
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
