import { of } from 'rxjs'
import { AjaxResponse, AjaxError } from 'rxjs/ajax'
import { extractAjaxErrorInfo } from '../../utils/ajaxError'
import * as A from '../spacesSlice'
import { Epic, ofType } from 'redux-observable'
import { ActionType } from 'typesafe-actions'
import { RootState } from '../../rootReducer'
import { flatMap, catchError, map, delay } from 'rxjs/operators'
import { OptionsCreator, ajaxObservable } from '../../utils/ajaxEpic'
import { PayloadType } from '../../utils/utilityTypes'

export type Actions = ActionType<
  | typeof A.loadSpaces
  | typeof A.loadSpacesSucceeded
  | typeof A.loadSpacesFailed
  | typeof A.loadSpacesReset
>

export const loadAjaxOptions: OptionsCreator<PayloadType<
  A.LoadSpacesAction
>> = _action => ({
  url: 'http://localhost:3000/api/v1/spaces',
  method: 'GET',
  crossDomain: true,
  withCredentials: true,
  responseType: 'json'
})

const loadSpaces = ajaxObservable(loadAjaxOptions)
const loadSpacesSuccess = (r: AjaxResponse) => A.loadSpacesSucceeded(r.response)
const loadSpacesFailure = (e: AjaxError) =>
  of(A.loadSpacesFailed(extractAjaxErrorInfo(e)))

export const loadSpacesEpic: Epic<Actions, Actions, RootState> = (
  action$,
  _state$,
  { loadSpacesFn = loadSpaces }: { loadSpacesFn?: typeof loadSpaces } = {}
) =>
  action$.pipe(
    ofType<Actions, A.LoadSpacesAction>(A.loadSpaces.type),
    flatMap(action =>
      loadSpacesFn(action).pipe(
        map(loadSpacesSuccess),
        catchError(loadSpacesFailure)
      )
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
