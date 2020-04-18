import {
  configureStore,
  getDefaultMiddleware,
  Middleware,
} from '@reduxjs/toolkit'
import rootReducer, { RootState } from './rootReducer'
import logger from 'redux-logger'

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware<RootState>(), logger as Middleware],
})

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default
    store.replaceReducer(newRootReducer)
  })
}

export type AppDispatch = typeof store.dispatch

export default store
