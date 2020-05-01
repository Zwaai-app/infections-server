import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type LoginCredentials = {
  username: string
  password: string
}

export type UserState = {
  token: string | null
}

const initialState: UserState = {
  token: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login (state, action: PayloadAction<LoginCredentials>) {
      state.token = null
    },
    loginSucceeded (state, action: PayloadAction<string>) {
      state.token = action.payload
    },
    loginFailed (state, action: PayloadAction<Error>) {
      state.token = null
    },
    logout (state, action: PayloadAction<void>) {
      state.token = null
    }
  }
})

export type LoginAction = ReturnType<typeof login>
export type LoginSucceededAction = ReturnType<typeof loginSucceeded>
export type LoginFailedAction = ReturnType<typeof loginFailed>

export const { login, loginSucceeded, loginFailed, logout } = userSlice.actions

export default userSlice.reducer
