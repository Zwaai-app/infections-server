import { updateSpaceEpic, updateAjaxOptions } from './updateSpace'
import {
  updateSpace,
  updateSpaceSucceeded,
  loadSpaces,
  updateSpaceFailed,
  NewSpaceFields,
  Space
} from '../spacesSlice'
import { ActionsObservable } from 'redux-observable'
import { initialStateObservable } from '../../testUtils/stateObservable'
import { of, throwError } from 'rxjs'
import { toArray } from 'rxjs/operators'
import { MockAjaxError } from '../../testUtils/MockAjaxError'
import * as O from 'fp-ts/lib/Option'

const spaceData: NewSpaceFields = {
  name: 'foo',
  description: 'bar',
  autoCheckout: O.some(1800)
}
const space: Space = {
  _id: 'foo_id',
  ...spaceData,
  locationCode: 'some location code',
  createdAt: Date.now(),
  updatedAt: Date.now()
}

it('creates the right ajax options', () => {
  const updateAction = updateSpace(space)
  const options = updateAjaxOptions(updateAction)
  expect(options.method).toEqual('PUT')
  expect(options.url).toMatch(/\/api\/v1\/space$/)
  expect(options.body.autoCheckout).toBe(1800)
  expect(options.body.createdAt).toBeUndefined()
  expect(options.body.modifiedAt).toBeUndefined()
})

it('can update a space', done => {
  const action$ = ActionsObservable.of(updateSpace(space))
  const state$ = initialStateObservable()
  const updateSpaceFn = () => of({})
  updateSpaceEpic(action$, state$, { updateSpaceFn })
    .pipe(toArray())
    .subscribe(emittedActions => {
      expect(emittedActions).toEqual([updateSpaceSucceeded(), loadSpaces()])
      done()
    })
})

it('reports update space errors', done => {
  const action$ = ActionsObservable.of(updateSpace(space))
  const state$ = initialStateObservable()
  const updateSpaceFn = () => throwError(new MockAjaxError('some error'))
  updateSpaceEpic(action$, state$, { updateSpaceFn })
    .pipe(toArray())
    .subscribe(emittedActions => {
      expect(emittedActions).toEqual([
        updateSpaceFailed({ message: 'some error' }),
        loadSpaces()
      ])
      done()
    })
})
