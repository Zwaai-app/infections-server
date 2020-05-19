import { ActionsObservable } from 'redux-observable'
import {
  createSpace,
  storeNewSpaceStarted,
  storeNewSpaceSucceeded,
  storeNewSpaceFailed,
  loadSpaces,
  SpaceFields
} from './spacesSlice'
import * as O from 'fp-ts/lib/Option'
import { initialStateObservable } from '../testUtils/stateObservable'
import { storeNewSpaceEpic } from './spaceEpic'
import { of, throwError } from 'rxjs'
import { MockAjaxError } from '../testUtils/MockAjaxError'
import { toArray } from 'rxjs/operators'

const spaceData: SpaceFields = {
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
        storeNewSpaceFailed({ message: 'some error' }),
        loadSpaces()
      ])
      done()
    })
})
