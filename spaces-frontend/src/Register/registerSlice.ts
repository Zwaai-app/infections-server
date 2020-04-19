import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface RegistrationData {
  email: string
  phone: string
  password: string
  consented: boolean
}

export const toRegistrationData = ([email, phone, password, consented]: [
  string,
  string,
  string,
  boolean
]): RegistrationData => ({ email, phone, password, consented })

type RegistrationStep = 'data' | 'payment' | 'confirmation'

type RegistrationState = {
  data: RegistrationData
  step: RegistrationStep
}

let initialState: RegistrationState = {
  data: {
    email: '',
    phone: '',
    password: '',
    consented: false,
  },
  step: 'data',
}

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setRegistrationData(state, action: PayloadAction<RegistrationData>) {
      state.data = action.payload
    },
  },
})

export const { setRegistrationData } = registerSlice.actions

export default registerSlice.reducer
