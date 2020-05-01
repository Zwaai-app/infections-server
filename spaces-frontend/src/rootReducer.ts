import { combineReducers } from '@reduxjs/toolkit'
import registerReducer from './Register/registerSlice'
import userReducer from './User/userSlice'
import profileReducer from './Profile/profileSlice'

const rootReducer = combineReducers({
  register: registerReducer,
  user: userReducer,
  profile: profileReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
