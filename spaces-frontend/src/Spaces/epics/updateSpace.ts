import * as A from '../spacesSlice'
import { ajaxObservable, OptionsCreator } from '../../utils/ajaxEpic'
import { AjaxResponse, AjaxError } from 'rxjs/ajax'
import { extractAjaxErrorInfo } from '../../utils/ajaxError'
import { of } from 'rxjs'
import { PayloadType } from '../../utils/utilityTypes'
import { autoCheckoutToNumber } from '../conversions'
import { Epic, ofType } from 'redux-observable'
import { RootState } from '../../rootReducer'
import { ActionType } from 'typesafe-actions'
import { flatMap, map, catchError, endWith } from 'rxjs/operators'

export type Actions = ActionType<
  | typeof A.loadSpaces
  | typeof A.updateSpace
  | typeof A.updateSpaceSucceeded
  | typeof A.updateSpaceFailed
>

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
    autoCheckout: autoCheckoutToNumber(action.payload.autoCheckout),
    createdAt: undefined,
    modifiedAt: undefined
  }
})

const updateSpace = ajaxObservable(updateAjaxOptions)
const updateSuccess = (_r: AjaxResponse) => A.updateSpaceSucceeded()
const updateFailed = (e: AjaxError) =>
  of(A.updateSpaceFailed(extractAjaxErrorInfo(e)))

export const updateSpaceEpic: Epic<Actions, Actions, RootState> = (
  action$,
  _state$,
  { updateSpaceFn = updateSpace }: { updateSpaceFn?: typeof updateSpace } = {}
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
