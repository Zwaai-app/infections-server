import { ActionType } from 'typesafe-actions'
import { Epic, ofType } from 'redux-observable'
import { RootState } from '../rootReducer'
import { flatMap, map, catchError } from 'rxjs/operators'
import { ajax, AjaxResponse, AjaxError } from 'rxjs/ajax'
import { of, Observable } from 'rxjs'
import {
  profileLoaded,
  loadProfile,
  profileLoadFailed,
  LoadProfileAction
} from './profileSlice'

export type Actions = ActionType<
  typeof loadProfile | typeof profileLoaded | typeof profileLoadFailed
>

type getProfileFn = () => Observable<any>

const getProfile: getProfileFn = () =>
  ajax({
    url: 'http://localhost:3000/api/v1/account/profile',
    method: 'GET',
    crossDomain: true,
    withCredentials: true,
    responseType: 'json'
  })

const success = (r: AjaxResponse) => profileLoaded(r.response)
const failed = (e: AjaxError) => of(profileLoadFailed(e.message))

export const loadProfileEpic: Epic<Actions, Actions, RootState> = (
  action$,
  _state$,
  { getProfileFn = getProfile }: { getProfileFn?: getProfileFn } = {}
) =>
  action$.pipe(
    ofType<Actions, LoadProfileAction>(loadProfile.type),
    flatMap(_action => getProfileFn().pipe(map(success), catchError(failed)))
  )

export const allEpics = [loadProfileEpic]
