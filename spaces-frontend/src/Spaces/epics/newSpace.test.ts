import { storeNewSpaceEpic, storeAjaxOptions } from './newSpace'
import * as O from 'fp-ts/lib/Option'
import {
  SpaceFields,
  createSpace,
  storeNewSpaceStarted,
  storeNewSpaceSucceeded,
  loadSpaces,
  storeNewSpaceFailed
} from '../spacesSlice'
import { ActionsObservable } from 'redux-observable'
import { initialStateObservable } from '../../testUtils/stateObservable'
import { of, throwError } from 'rxjs'
import { toArray } from 'rxjs/operators'
import { MockAjaxError } from '../../testUtils/MockAjaxError'

const spaceData: SpaceFields = {
  name: 'foo',
  description: 'bar',
  autoCheckout: O.some(1800)
}

it('creates the right ajax options', () => {
  const createAction = createSpace(spaceData)
  const options = storeAjaxOptions(createAction)
  expect(options.method).toEqual('POST')
  expect(options.url).toMatch(/\/api\/v1\/space$/)
  expect(options.body.name).toEqual(spaceData.name)
  expect(options.body.description).toEqual(spaceData.description)
  expect(options.body.autoCheckout).toBe(1800)
  expect(options.body.createdAt).toBeUndefined()
  expect(options.body.modifiedAt).toBeUndefined()
})

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
