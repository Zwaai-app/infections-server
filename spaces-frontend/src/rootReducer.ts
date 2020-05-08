import { combineReducers } from '@reduxjs/toolkit'
import registerReducer from './Register/registerSlice'
import userReducer, { logout } from './User/userSlice'
import profileReducer from './Profile/profileSlice'
import spacesReducer from './Spaces/spacesSlice'

const appReducer = combineReducers({
  register: registerReducer,
  user: userReducer,
  profile: profileReducer,
  spaces: spacesReducer
})
export type RootState = ReturnType<typeof appReducer>

const initialState = appReducer(undefined, { type: 'GET_INITIAL_STATE' })

type RootReducerType = typeof appReducer
const rootReducer: RootReducerType = (state, action) => {
  if (action.type === logout.type) {
    state = initialState
  }
  return appReducer(state, action)
}

export default rootReducer
