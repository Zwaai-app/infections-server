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
import { MockAjaxError } from '../testUtils/MockAjaxError'
import { toArray } from 'rxjs/operators'

const spaceData = {
  name: 'foo',
  description: 'bar',
  autoCheckout: O.some(1800)
}

it('can create a new space', done => {
  const action$ = ActionsObservable.of(createSpace(spaceData))
  const state$ = initialStateObservable()
  const storeNewSpaceFn = () => of({})
  storeNewSpaceEpic(action$, state$, { storeNewSpaceFn })
    .pipe(toArray())
    .subscribe(emittedActions => {
      expect(emittedActions).toEqual([
        storeNewSpaceStarted(),
        storeNewSpaceSucceeded(),
        loadSpaces()
      ])
      done()
    })
})

it('reports store errors', done => {
  const action$ = ActionsObservable.of(createSpace(spaceData))
  const state$ = initialStateObservable()
  const storeNewSpaceFn = () => throwError(new MockAjaxError('some error'))
  storeNewSpaceEpic(action$, state$, { storeNewSpaceFn })
    .pipe(toArray())
    .subscribe(emittedActions => {
      expect(emittedActions).toEqual([
        storeNewSpaceStarted(),
        storeNewSpaceFailed('some error'),
        loadSpaces()
      ])
      done()
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
