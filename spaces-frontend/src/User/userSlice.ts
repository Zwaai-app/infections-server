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
    logout (state, action: PayloadAction<void>) {
      state.token = null
    }
  }
})

export const { logout } = userSlice.actions

export default userSlice.reducer
