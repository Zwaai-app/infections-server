import { ActionsObservable } from 'redux-observable'
import {
  createSpace,
  storeNewSpaceStarted,
  storeNewSpaceSucceeded,
  storeNewSpaceFailed,
  loadSpaces,
  loadSpacesSucceeded,
  SpaceFromServer,
  loadSpacesFailed,
  deleteSpace,
  Space,
  SpaceFields,
  deleteSucceeded,
  deleteFailed
} from './spacesSlice'
import * as O from 'fp-ts/lib/Option'
import { initialStateObservable } from '../testUtils/stateObservable'
import { storeNewSpaceEpic, loadSpacesEpic, deleteSpaceEpic } from './spaceEpic'
import { of, throwError } from 'rxjs'
import { MockAjaxError } from '../testUtils/MockAjaxError'
import { toArray } from 'rxjs/operators'

const spaceData: SpaceFields = {
  name: 'foo',
  description: 'bar',
  autoCheckout: O.some(1800)
}
const space: Space = {
  _id: 'foo_id',
  ...spaceData,
  createdAt: Date.now(),
  updatedAt: Date.now()
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

it('can load spaces', done => {
  expect.assertions(1)
  const action$ = ActionsObservable.of(loadSpaces())
  const state$ = initialStateObservable()
  const spaces: SpaceFromServer[] = [
    {
      _id: '1',
      name: '1',
      description: '1',
      autoCheckout: -1,
      createdAt: '',
      updatedAt: ''
    }
  ]
  const loadSpacesFn = () => of({ response: spaces })
  loadSpacesEpic(action$, state$, { loadSpacesFn }).subscribe(action => {
    expect(action).toEqual(loadSpacesSucceeded(spaces))
    done()
  })
})

it('reports load errors', done => {
  expect.assertions(1)
  const action$ = ActionsObservable.of(loadSpaces())
  const state$ = initialStateObservable()
  const loadSpacesFn = () => throwError(new MockAjaxError('some error'))
  loadSpacesEpic(action$, state$, { loadSpacesFn }).subscribe(action => {
    expect(action).toEqual(loadSpacesFailed({ message: 'some error' }))
    done()
  })
})

it('can delete a space', done => {
  const action$ = ActionsObservable.of(deleteSpace(space))
  const state$ = initialStateObservable()
  const deleteSpaceFn = () => of({})
  deleteSpaceEpic(action$, state$, { deleteSpaceFn })
    .pipe(toArray())
    .subscribe(emittedActions => {
      expect(emittedActions).toEqual([deleteSucceeded(), loadSpaces()])
      done()
    })
})

it('reports delete space errors', done => {
  const action$ = ActionsObservable.of(deleteSpace(space))
  const state$ = initialStateObservable()
  const deleteSpaceFn = () => throwError(new MockAjaxError('some error'))
  deleteSpaceEpic(action$, state$, { deleteSpaceFn })
    .pipe(toArray())
    .subscribe(emittedActions => {
      expect(emittedActions).toEqual([
        deleteFailed({ message: 'some error' }),
        loadSpaces()
      ])
      done()
    })
})
