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
  LoadProfileAction,
  updateProfile,
  UpdateProfileAction,
  updateProfileSucceeded,
  updateProfileFailed
} from './profileSlice'

export type Actions = ActionType<
  typeof loadProfile | typeof profileLoaded | typeof profileLoadFailed
>

type GetProfileFn = () => Observable<any>

const getProfile: GetProfileFn = () =>
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
  { getProfileFn = getProfile }: { getProfileFn?: GetProfileFn } = {}
) =>
  action$.pipe(
    ofType<Actions, LoadProfileAction>(loadProfile.type),
    flatMap(_action => getProfileFn().pipe(map(success), catchError(failed)))
  )

type StoreProfileFn = (
  action: UpdateProfileAction,
  email: string
) => Observable<any>
const storeProfile: StoreProfileFn = (
  action: UpdateProfileAction,
  email: string
) => {
  return ajax({
    url: 'http://localhost:3000/api/v1/account/profile',
    method: 'POST',
    crossDomain: true,
    withCredentials: true,
    responseType: 'json',
    body: { ...action.payload, email }
  })
}
const updateSuccess = (_r: AjaxResponse) => updateProfileSucceeded()
const updateFailed = (e: AjaxError) => of(updateProfileFailed(e.message))

export const storeProfileEpic: Epic<Actions, Actions, RootState> = (
  action$,
  state$,
  { storeProfileFn = storeProfile }: { storeProfileFn?: StoreProfileFn } = {}
) =>
  action$.pipe(
    ofType<Actions, UpdateProfileAction>(updateProfile.type),
    flatMap(action =>
      storeProfileFn(action, state$.value.user.email).pipe(
        map(updateSuccess),
        catchError(updateFailed)
      )
    )
  )

export const allEpics = [loadProfileEpic, storeProfileEpic]
