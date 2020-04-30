import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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

export const { loginSucceeded, loginFailed, logout } = userSlice.actions

export default userSlice.reducer
