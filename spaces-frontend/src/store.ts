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

type SystemActionsWithPayload =
  | RegisterUser.Actions
  | User.Actions
  | Profile.Actions
type SystemActions = ActionType<SystemActionsWithPayload>
type finalActions = SystemActions

const epicMiddleware = createEpicMiddleware<
  finalActions,
  finalActions,
  RootState
>()
const rootEpic = combineEpics(
  RegisterUser.epic,
  ...User.allEpics,
  ...Profile.allEpics
)

const serializedPersistdState = localStorage.getItem('reduxState')
const persistedState: RootState | undefined = serializedPersistdState
  ? JSON.parse(serializedPersistdState)
  : undefined

const store = configureStore({
  reducer: rootReducer,
  middleware: [
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
