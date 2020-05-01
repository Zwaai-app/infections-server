import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type LoginCredentials = {
  username: string
  password: string
}

export type UserState = {
  loggedIn: boolean
}

const initialState: UserState = {
  loggedIn: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login (state, action: PayloadAction<LoginCredentials>) {
      state.loggedIn = false
    },
    loginSucceeded (state, action: PayloadAction<void>) {
      state.loggedIn = true
    },
    loginFailed (state, action: PayloadAction<string>) {
      state.loggedIn = false
    },
    logout (state, action: PayloadAction<void>) {
      state.loggedIn = false
    }
  }
})

export type LoginAction = ReturnType<typeof login>
export type LoginSucceededAction = ReturnType<typeof loginSucceeded>
export type LoginFailedAction = ReturnType<typeof loginFailed>
export type LogoutAction = ReturnType<typeof logout>

export const { login, loginSucceeded, loginFailed, logout } = userSlice.actions

export default userSlice.reducer
