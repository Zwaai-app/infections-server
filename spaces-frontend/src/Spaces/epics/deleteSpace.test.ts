import { deleteSpaceEpic, deleteAjaxOptions } from './deleteSpace'
import { ActionsObservable } from 'redux-observable'
import {
  deleteSpace,
  deleteSucceeded,
  loadSpaces,
  deleteFailed,
  NewSpaceFields,
  Space
} from '../spacesSlice'
import { initialStateObservable } from '../../testUtils/stateObservable'
import { of, throwError } from 'rxjs'
import { MockAjaxError } from '../../testUtils/MockAjaxError'
import { toArray } from 'rxjs/operators'
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
  const deleteAction = deleteSpace(space)
  const options = deleteAjaxOptions(deleteAction)
  expect(options.method).toEqual('DELETE')
  expect(options.url).toMatch(/\/api\/v1\/space$/)
  expect(options.body).toEqual({ _id: 'foo_id' })
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
