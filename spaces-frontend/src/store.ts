import {
  configureStore,
  getDefaultMiddleware,
  Middleware
} from '@reduxjs/toolkit'
import rootReducer, { RootState } from './rootReducer'
import logger from 'redux-logger'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { ActionType } from 'typesafe-actions'
import * as RegisterUser from './Register/registerEpic'
import * as User from './User/userEpic'
import * as Profile from './Profile/profileEpic'
import * as Space from './Spaces/spaceEpic'
import { logout } from './User/userSlice'

type SystemActionsWithPayload =
  | RegisterUser.Actions
  | User.Actions
  | Profile.Actions
  | Space.Actions
type SystemActions = ActionType<SystemActionsWithPayload>
type FinalActions = SystemActions

const epicMiddleware = createEpicMiddleware<
  FinalActions,
  FinalActions,
  RootState
>()
const rootEpic = combineEpics(
  ...RegisterUser.allEpics,
  ...User.allEpics,
  ...Profile.allEpics,
  ...Space.allEpics
)

const serializedPersistdState = localStorage.getItem('reduxState')
const persistedState: RootState | undefined = serializedPersistdState
  ? JSON.parse(serializedPersistdState)
  : undefined

const logoutOnAuthError: Middleware = _api => next => action => {
  const code = action?.payload?.code
  if (
    code &&
    action?.payload?.hasOwnProperty('message') &&
    (code === 401 || code === 403)
  ) {
    next(logout())
  } else {
    next(action)
  }
}

const store = configureStore({
  reducer: rootReducer,
  middleware: [
    logoutOnAuthError,
    epicMiddleware,
    ...getDefaultMiddleware<RootState>(),
    logger as Middleware
  ],
  preloadedState: persistedState
})

store.subscribe(() => {
  localStorage.setItem('reduxState', JSON.stringify(store.getState()))
})

epicMiddleware.run(rootEpic)

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default
    store.replaceReducer(newRootReducer)
  })
}

export type AppDispatch = typeof store.dispatch

export default store
