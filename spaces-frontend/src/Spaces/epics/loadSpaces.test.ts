import { loadSpacesEpic } from './loadSpaces'
import {
  loadSpaces,
  SpaceFromServer,
  loadSpacesSucceeded,
  loadSpacesFailed
} from '../spacesSlice'
import { ActionsObservable } from 'redux-observable'
import { initialStateObservable } from '../../testUtils/stateObservable'
import { of, throwError } from 'rxjs'
import { MockAjaxError } from '../../testUtils/MockAjaxError'

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
