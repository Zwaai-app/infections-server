import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
}

export function isLoginError (status: LoginStatus) {
  // tslint:disable-next-line: strict-type-predicates
  return (status as LoginError).error !== undefined
}

const initialState: UserState = { status: 'loggedOut' }

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login (state, _action: PayloadAction<LoginCredentials>) {
      state.status = 'loggingIn'
    },
    loginSucceeded (state, _action: PayloadAction<void>) {
      state.status = 'loggedIn'
    },
    loginFailed (state, action: PayloadAction<string>) {
      state.status = { error: action.payload }
    },
    logout (state, _action: PayloadAction<void>) {
      state.status = 'loggedOut'
    }
  }
})

export type LoginAction = ReturnType<typeof login>
export type LoginSucceededAction = ReturnType<typeof loginSucceeded>
export type LoginFailedAction = ReturnType<typeof loginFailed>
export type LogoutAction = ReturnType<typeof logout>

export const { login, loginSucceeded, loginFailed, logout } = userSlice.actions

export default userSlice.reducer
