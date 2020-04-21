import {
  configureStore,
  getDefaultMiddleware,
  Middleware,
} from '@reduxjs/toolkit'
import rootReducer, { RootState } from './rootReducer'
import logger from 'redux-logger'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { ActionType } from 'typesafe-actions'
import * as RegisterUser from './Register/epic'

type SystemActionsWithPayload = RegisterUser.Actions
type SystemActions = ActionType<SystemActionsWithPayload>
type finalActions = SystemActions

const epicMiddleware = createEpicMiddleware<
  finalActions,
  finalActions,
  RootState
>()
const rootEpic = combineEpics(RegisterUser.epic)

const store = configureStore({
  reducer: rootReducer,
  middleware: [
    epicMiddleware,
    ...getDefaultMiddleware<RootState>(),
    logger as Middleware,
  ],
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
