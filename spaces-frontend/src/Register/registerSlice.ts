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

type RegistrationState = {
  data: RegistrationData
}

let initialState: RegistrationState = {
  data: {
    email: '',
    phone: '',
    password: '',
    consented: false,
  },
}

export interface SignupError {
  message: string
  errors: any
}

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setRegistrationData(state, action: PayloadAction<RegistrationData>) {
      state.data = action.payload
    },
    signupSucceeded(state, action: PayloadAction<any>) {
      console.debug('signup succeeded', action.payload)
    },
    signupFailed(state, action: PayloadAction<SignupError>) {
      console.debug('signupFailed', action.payload)
    },
  },
})

export const {
  setRegistrationData,
  signupSucceeded,
  signupFailed,
} = registerSlice.actions

export default registerSlice.reducer
