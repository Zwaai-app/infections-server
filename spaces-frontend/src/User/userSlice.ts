import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ErrorInfo } from '../utils/ajaxError'

export type LoginCredentials = {
  username: string
  password: string
}

type LoggedOut = 'loggedOut'
type LoggingIn = 'loggingIn'
type LoggedIn = 'loggedIn'
interface LoginError {
  error: string
}
type LoginStatus = LoggedOut | LoggingIn | LoggedIn | LoginError

export type UserState = {
  status: LoginStatus
  email: string
}

export function isLoginError (status: LoginStatus) {
  // tslint:disable-next-line: strict-type-predicates
  return (status as LoginError).error !== undefined
}

const initialState: UserState = { status: 'loggedOut', email: '' }

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login (state, action: PayloadAction<LoginCredentials>) {
      state.status = 'loggingIn'
      state.email = action.payload.username
    },
    loginSucceeded (state, _action: PayloadAction<void>) {
      state.status = 'loggedIn'
    },
    loginFailed (state, action: PayloadAction<ErrorInfo>) {
      state.status = { error: action.payload.message }
      state.email = ''
    },
    logout (state, _action: PayloadAction<void>) {
      state.status = 'loggedOut'
      state.email = ''
    },
    setFromRegistration (state, action: PayloadAction<string>) {
      state.status = 'loggedIn'
      state.email = action.payload
    }
  }
})

export type LoginAction = ReturnType<typeof login>
export type LoginSucceededAction = ReturnType<typeof loginSucceeded>
export type LoginFailedAction = ReturnType<typeof loginFailed>
export type LogoutAction = ReturnType<typeof logout>

export const {
  login,
  loginSucceeded,
  loginFailed,
  logout,
  setFromRegistration
} = userSlice.actions

export default userSlice.reducer
