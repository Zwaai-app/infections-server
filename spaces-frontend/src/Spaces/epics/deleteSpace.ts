import * as A from '../spacesSlice'
import { Observable, of } from 'rxjs'
import { ActionType } from 'typesafe-actions'
import { ajax, AjaxResponse, AjaxError } from 'rxjs/ajax'
import { extractAjaxErrorInfo } from '../../utils/ajaxError'
import { Epic, ofType } from 'redux-observable'
import { RootState } from '../../rootReducer'
import { flatMap, catchError, endWith, map } from 'rxjs/operators'

export type Actions = ActionType<
  | typeof A.loadSpaces
  | typeof A.deleteSpace
  | typeof A.deleteSucceeded
  | typeof A.deleteFailed
>

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
