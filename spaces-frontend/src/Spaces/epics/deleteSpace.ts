import * as A from '../spacesSlice'
import { Observable, of } from 'rxjs'
import { ActionType } from 'typesafe-actions'
import { AjaxResponse, AjaxError } from 'rxjs/ajax'
import { extractAjaxErrorInfo } from '../../utils/ajaxError'
import { Epic, ofType } from 'redux-observable'
import { RootState } from '../../rootReducer'
import { flatMap, catchError, endWith, map } from 'rxjs/operators'
import { OptionsCreator, ajaxObservable } from '../../utils/ajaxEpic'
import { PayloadType } from '../../utils/utilityTypes'

export type Actions = ActionType<
  | typeof A.loadSpaces
  | typeof A.deleteSpace
  | typeof A.deleteSucceeded
  | typeof A.deleteFailed
>

export const deleteAjaxOptions: OptionsCreator<PayloadType<
  A.DeleteSpaceAction
>> = action => ({
  url: 'http://localhost:3000/api/v1/space',
  method: 'DELETE',
  crossDomain: true,
  withCredentials: true,
  responseType: 'json',
  body: { _id: action.payload._id }
})

type DeleteSpaceFn = (action: A.DeleteSpaceAction) => Observable<any>
const deleteSpace = ajaxObservable(deleteAjaxOptions)

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
