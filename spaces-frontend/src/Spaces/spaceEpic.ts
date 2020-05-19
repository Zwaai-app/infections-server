import * as A from './spacesSlice'
import { ActionType } from 'typesafe-actions'
import { Epic, ofType } from 'redux-observable'
import { RootState } from '../rootReducer'
import { Observable, of } from 'rxjs'
import { ajax, AjaxResponse, AjaxError } from 'rxjs/ajax'
import {
  flatMap,
  map,
  catchError,
  startWith,
  delay,
  endWith
} from 'rxjs/operators'
import { extractAjaxErrorInfo } from '../utils/ajaxError'
import { PayloadAction } from '@reduxjs/toolkit'
import { PayloadType } from '../utils/utilityTypes'
import { autoCheckoutToServer } from './conversions'

export type Actions = ActionType<
  | typeof A.createSpace
  | typeof A.storeNewSpaceStarted
  | typeof A.storeNewSpaceSucceeded
  | typeof A.storeNewSpaceFailed
  | typeof A.loadSpaces
  | typeof A.loadSpacesSucceeded
  | typeof A.loadSpacesFailed
  | typeof A.loadSpacesReset
  | typeof A.deleteSpace
  | typeof A.deleteSucceeded
  | typeof A.deleteFailed
>

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

type DeleteSpaceFn = (action: A.DeleteSpaceAction) => Observable<any>
const deleteSpace: DeleteSpaceFn = action =>
  ajax({
    url: 'http://localhost:3000/api/v1/space',
    method: 'DELETE',
    crossDomain: true,
    withCredentials: true,
    responseType: 'json',
    body: { _id: action.payload._id }
  })

const deleteSuccess = (_r: AjaxResponse) => A.deleteSucceeded()
const deleteFailed = (e: AjaxError) =>
  of(A.deleteFailed(extractAjaxErrorInfo(e)))

export const deleteSpaceEpic: Epic<Actions, Actions, RootState> = (
  action$,
  _state$,
  { deleteSpaceFn = deleteSpace }: { deleteSpaceFn?: DeleteSpaceFn } = {}
) =>
  action$.pipe(
    ofType<Actions, A.DeleteSpaceAction>(A.deleteSpace.type),
    flatMap(action =>
      deleteSpaceFn(action).pipe(
        map(deleteSuccess),
        catchError(deleteFailed),
        endWith(A.loadSpaces())
      )
    )
  )

type LoadSpacesFn = () => Observable<any>
const loadSpaces: LoadSpacesFn = () =>
  ajax({
    url: 'http://localhost:3000/api/v1/spaces',
    method: 'GET',
    crossDomain: true,
    withCredentials: true,
    responseType: 'json'
  })

const loadSpacesSuccess = (r: AjaxResponse) => A.loadSpacesSucceeded(r.response)
const loadSpacesFailure = (e: AjaxError) =>
  of(A.loadSpacesFailed(extractAjaxErrorInfo(e)))

export const loadSpacesEpic: Epic<Actions, Actions, RootState> = (
  action$,
  _state$,
  { loadSpacesFn = loadSpaces }: { loadSpacesFn?: LoadSpacesFn } = {}
) =>
  action$.pipe(
    ofType<Actions, A.LoadSpacesAction>(A.loadSpaces.type),
    flatMap(() =>
      loadSpacesFn().pipe(map(loadSpacesSuccess), catchError(loadSpacesFailure))
    )
  )

export const resetAfterLoadSuccess: Epic<Actions, Actions, RootState> = (
  action$,
  _state$
) =>
  action$.pipe(
    ofType<Actions, A.LoadSpacesSucceededAction>(A.loadSpacesSucceeded.type),
    flatMap(() => of(A.loadSpacesReset()).pipe(delay(3e3)))
  )

type OptionsCreator<P> = (action: PayloadAction<P>) => any
const ajaxFunction = <P>(optionsCreator: OptionsCreator<P>) => (
  action: PayloadAction<P>
): Observable<any> => ajax(optionsCreator(action))

export const updateAjaxOptions: OptionsCreator<PayloadType<
  A.UpdateSpaceAction
>> = action => ({
  url: 'http://localhost:3000/api/v1/space',
  method: 'PUT',
  crossDomain: true,
  withCredentials: true,
  responseType: 'json',
  body: {
    ...action.payload,
    autoCheckout: autoCheckoutToServer(action.payload.autoCheckout),
    createdAt: undefined,
    modifiedAt: undefined
  }
})

type UpdateSpaceFn = (action: A.UpdateSpaceAction) => Observable<any>
const updateSpace: UpdateSpaceFn = ajaxFunction(updateAjaxOptions)

const updateSuccess = (_r: AjaxResponse) => A.updateSucceeded()
const updateFailed = (e: AjaxError) =>
  of(A.updateSpaceFailed(extractAjaxErrorInfo(e)))

export const updateSpaceEpic: Epic<Actions, Actions, RootState> = (
  action$,
  _state$,
  { updateSpaceFn = updateSpace }: { updateSpaceFn?: UpdateSpaceFn } = {}
) =>
  action$.pipe(
    ofType<Actions, A.UpdateSpaceAction>(A.updateSpace.type),
    flatMap(action =>
      updateSpaceFn(action).pipe(
        map(updateSuccess),
        catchError(updateFailed),
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
