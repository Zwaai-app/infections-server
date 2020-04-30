import { combineReducers } from '@reduxjs/toolkit'
import registerReducer from './Register/registerSlice'
import userReducer from './User/userSlice'

const rootReducer = combineReducers({
  register: registerReducer,
  user: userReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
