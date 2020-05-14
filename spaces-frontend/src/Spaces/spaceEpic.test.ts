import { ActionsObservable } from 'redux-observable'
import {
  createSpace,
  storeNewSpaceStarted,
  storeNewSpaceSucceeded,
  storeNewSpaceFailed,
  loadSpaces,
  loadSpacesSucceeded,
  SpaceFromServer,
  loadSpacesFailed
} from './spacesSlice'
import * as O from 'fp-ts/lib/Option'
import { initialStateObservable } from '../testUtils/stateObservable'
import { storeNewSpaceEpic, loadSpacesEpic } from './spaceEpic'
import { of, throwError } from 'rxjs'
import { Action } from '@reduxjs/toolkit'
import { MockAjaxError } from '../testUtils/MockAjaxError'

const spaceData = {
  name: 'foo',
  description: 'bar',
  autoCheckout: O.some(1800)
}

it('can create a new space', done => {
  expect.assertions(2)
  const action$ = ActionsObservable.of(createSpace(spaceData))
  const state$ = initialStateObservable()
  const storeNewSpaceFn = () => of({})
  let dispatchedActions: Action[] = []
  storeNewSpaceEpic(action$, state$, { storeNewSpaceFn }).subscribe(action => {
    dispatchedActions.push(action)
    if (dispatchedActions.length === 2) {
      expect(dispatchedActions[0]).toEqual(storeNewSpaceStarted())
      expect(dispatchedActions[1]).toEqual(storeNewSpaceSucceeded())
      done()
    }
  })
})

it('reports store errors', done => {
  const action$ = ActionsObservable.of(createSpace(spaceData))
  const state$ = initialStateObservable()
  const storeNewSpaceFn = () => throwError(new MockAjaxError('some error'))
  let dispatchedActions: Action[] = []
  storeNewSpaceEpic(action$, state$, { storeNewSpaceFn }).subscribe(action => {
    dispatchedActions.push(action)
    if (dispatchedActions.length === 2) {
      expect(dispatchedActions[0]).toEqual(storeNewSpaceStarted())
      expect(dispatchedActions[1]).toEqual(storeNewSpaceFailed('some error'))
      done()
    }
  })
})

it('can load spaces', () => {
  expect.assertions(1)
  const action$ = ActionsObservable.of(loadSpaces())
  const state$ = initialStateObservable()
  const spaces: SpaceFromServer[] = [
    { _id: '1', name: '1', description: '1', autoCheckout: -1 }
  ]
  const loadSpacesFn = () => of({ response: spaces })
  loadSpacesEpic(action$, state$, { loadSpacesFn }).subscribe(action => {
    expect(action).toEqual(loadSpacesSucceeded(spaces))
  })
})

it('reports load errors', () => {
  expect.assertions(1)
  const action$ = ActionsObservable.of(loadSpaces())
  const state$ = initialStateObservable()
  const loadSpacesFn = () => throwError(new MockAjaxError('some error'))
  loadSpacesEpic(action$, state$, { loadSpacesFn }).subscribe(action => {
    expect(action).toEqual(loadSpacesFailed('some error'))
  })
})
