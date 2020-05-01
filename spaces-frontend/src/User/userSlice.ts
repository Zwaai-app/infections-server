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
export type UserState = {
  status: LoggedOut | LoggingIn | LoggedIn | LoginError
}

const initialState: UserState = { status: 'loggedOut' }

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login (state, action: PayloadAction<LoginCredentials>) {
      state.status = 'loggedOut'
    },
    loginSucceeded (state, action: PayloadAction<void>) {
      state.status = 'loggedIn'
    },
    loginFailed (state, action: PayloadAction<string>) {
      state.status = { error: action.payload }
    },
    logout (state, action: PayloadAction<void>) {
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
