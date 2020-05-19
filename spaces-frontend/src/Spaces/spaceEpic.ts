import * as A from './spacesSlice'
import { ActionType } from 'typesafe-actions'
import { Epic, ofType } from 'redux-observable'
import { RootState } from '../rootReducer'
import { Observable, of } from 'rxjs'
import { ajax, AjaxResponse, AjaxError } from 'rxjs/ajax'
import { flatMap, map, catchError, startWith, endWith } from 'rxjs/operators'
import { extractAjaxErrorInfo } from '../utils/ajaxError'
import { autoCheckoutToServer } from './conversions'
import { updateSpaceEpic, Actions as UpdateActions } from './epics/updateSpace'
import { deleteSpaceEpic, Actions as DeleteActions } from './epics/deleteSpace'
import {
  loadSpacesEpic,
  resetAfterLoadSuccess,
  Actions as LoadActions
} from './epics/loadSpaces'

export type Actions =
  | ActionType<
      | typeof A.createSpace
      | typeof A.storeNewSpaceStarted
      | typeof A.storeNewSpaceSucceeded
      | typeof A.storeNewSpaceFailed
    >
  | LoadActions
  | UpdateActions
  | DeleteActions

type StoreNewSpaceFn = (action: A.CreateSpaceAction) => Observable<any>

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
      autoCheckout: autoCheckoutToServer(action.payload.autoCheckout)
    }
  })

const storeNewSuccess = (_r: AjaxResponse) => A.storeNewSpaceSucceeded()
const storeNewFailed = (e: AjaxError) => {
  return of(A.storeNewSpaceFailed(extractAjaxErrorInfo(e)))
}

export const storeNewSpaceEpic: Epic<Actions, Actions, RootState> = (
  action$,
  _state$,
  {
    storeNewSpaceFn = storeNewSpace
  }: { storeNewSpaceFn?: StoreNewSpaceFn } = {}
) =>
  action$.pipe(
    ofType<Actions, A.CreateSpaceAction>(A.createSpace.type),
    flatMap(action =>
      storeNewSpaceFn(action).pipe(
        map(storeNewSuccess),
        catchError(storeNewFailed),
        startWith(A.storeNewSpaceStarted()),
        endWith(A.loadSpaces())
      )
    )
  )

export const allEpics = [
  storeNewSpaceEpic,
  updateSpaceEpic,
  deleteSpaceEpic,
  loadSpacesEpic,
  resetAfterLoadSuccess
]
