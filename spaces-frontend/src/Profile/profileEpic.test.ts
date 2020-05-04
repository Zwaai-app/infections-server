import { loadProfileEpic } from './profileEpic'
import { ActionsObservable, StateObservable } from 'redux-observable'
import { loadProfile, profileLoaded, profileLoadFailed } from './profileSlice'
import { of, throwError } from 'rxjs'
import { initialStateObservable } from '../testUtils/stateObservable'
import { MockAjaxError } from '../testUtils/MockAjaxError'
import { parseURL } from 'whatwg-url'

const orgData = {
  organizationName: 'my org',
  organizationUrl: parseURL('http://example.com')!,
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
