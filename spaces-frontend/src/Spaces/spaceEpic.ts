import {
  createSpace,
  CreateSpaceAction,
  storeNewSpaceSucceeded,
  storeNewSpaceFailed,
  storeNewSpaceStarted
} from './spacesSlice'
import { ActionType } from 'typesafe-actions'
import { Epic, ofType } from 'redux-observable'
import { RootState } from '../rootReducer'
import { Observable, of } from 'rxjs'
import { ajax, AjaxResponse, AjaxError } from 'rxjs/ajax'
import { flatMap, map, catchError, startWith } from 'rxjs/operators'
import * as O from 'fp-ts/lib/Option'
import { constant } from 'fp-ts/lib/function'

export type Actions = ActionType<
  | typeof createSpace
  | typeof storeNewSpaceStarted
  | typeof storeNewSpaceSucceeded
  | typeof storeNewSpaceFailed
>

type StoreNewSpaceFn = (action: CreateSpaceAction) => Observable<any>

const storeNewSpace: StoreNewSpaceFn = action =>
  ajax({
    url: 'http://localhost:3000/api/v1/space',
    method: 'POST',
    crossDomain: true,
    withCredentials: true,
    responseType: 'json',
    body: {
      name: action.payload.name,
      description: action.payload.description,
      autoCheckout: O.getOrElse(constant(-1))(action.payload.autoCheckout)
    }
  })

const storeNewSuccess = (_r: AjaxResponse) => storeNewSpaceSucceeded()
const storeNewFailed = (e: AjaxError) => of(storeNewSpaceFailed(e.message))

export const storeNewSpaceEpic: Epic<Actions, Actions, RootState> = (
  action$,
  _state$,
  {
    storeNewSpaceFn = storeNewSpace
  }: { storeNewSpaceFn?: StoreNewSpaceFn } = {}
) =>
  action$.pipe(
    ofType<Actions, CreateSpaceAction>(createSpace.type),
    flatMap(action =>
      storeNewSpaceFn(action).pipe(
        map(storeNewSuccess),
        catchError(storeNewFailed),
        startWith(storeNewSpaceStarted())
      )
    )
  )

export const allEpics = [storeNewSpaceEpic]
