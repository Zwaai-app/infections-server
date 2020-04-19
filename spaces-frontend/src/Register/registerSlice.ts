import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface RegistrationData {
  email: string
  phone: string
  password: string
}

type RegistrationStep = 'data' | 'payment' | 'confirmation'

type RegistrationState = {
  step: RegistrationStep
} & RegistrationData

let initialState: RegistrationState = {
  email: '',
  phone: '',
  password: '',
  step: 'data',
}

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload
    },
    setPhone(state, action: PayloadAction<string>) {
      state.phone = action.payload
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload
    },
  },
})

export const { setEmail, setPhone, setPassword } = registerSlice.actions

export default registerSlice.reducer
