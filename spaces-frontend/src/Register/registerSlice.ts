import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface RegistrationData {
  email: string
  phone: string
  password1: string
  password2: string
}

type RegistrationStep = 'data' | 'payment' | 'confirmation'

type RegistrationState = {
  step: RegistrationStep
} & RegistrationData

let initialState: RegistrationState = {
  email: '',
  phone: '',
  password1: '',
  password2: '',
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
    setPassword1(state, action: PayloadAction<string>) {
      state.password1 = action.payload
    },
    setPassword2(state, action: PayloadAction<string>) {
      state.password2 = action.payload
    },
  },
})

export const {
  setEmail,
  setPhone,
  setPassword1,
  setPassword2,
} = registerSlice.actions

export default registerSlice.reducer
