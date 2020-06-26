import { Epic, ofType } from 'redux-observable'
import { RootState } from '../../rootReducer'
import { of } from 'rxjs'
import { AjaxResponse, AjaxError } from 'rxjs/ajax'
import { flatMap, map, catchError, startWith, endWith } from 'rxjs/operators'
import { extractAjaxErrorInfo } from '../../utils/ajaxError'
import { autoCheckoutToNumber } from '../conversions'
import * as A from '../spacesSlice'
import { ActionType } from 'typesafe-actions'
import { OptionsCreator, ajaxObservable } from '../../utils/ajaxEpic'
import { PayloadType } from '../../utils/utilityTypes'

export type Actions = ActionType<
  | typeof A.createSpace
  | typeof A.storeNewSpaceStarted
  | typeof A.storeNewSpaceSucceeded
  | typeof A.storeNewSpaceFailed
>

export const storeAjaxOptions: OptionsCreator<PayloadType<
  A.CreateSpaceAction
>> = action => ({
  url: 'http://localhost:3000/api/v1/space',
  method: 'POST',
  crossDomain: true,
  withCredentials: true,
  responseType: 'json',
  body: {
    name: action.payload.name,
    description: action.payload.description,
    autoCheckout: autoCheckoutToNumber(action.payload.autoCheckout)
  }
})

const storeNewSpace = ajaxObservable(storeAjaxOptions)

const storeNewSuccess = (_r: AjaxResponse) => A.storeNewSpaceSucceeded()
const storeNewFailed = (e: AjaxError) => {
  return of(A.storeNewSpaceFailed(extractAjaxErrorInfo(e)))
}

export const storeNewSpaceEpic: Epic<Actions, Actions, RootState> = (
  action$,
  _state$,
  {
    storeNewSpaceFn = storeNewSpace
  }: { storeNewSpaceFn?: typeof storeNewSpace } = {}
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
