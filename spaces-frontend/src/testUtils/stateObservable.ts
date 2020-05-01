import { RootState } from '../rootReducer'
import { StateObservable } from 'redux-observable'
import { Subject } from 'rxjs'
import store from '../store'

export const initialStateObservable = () =>
  new StateObservable<RootState>(new Subject(), store.getState())
