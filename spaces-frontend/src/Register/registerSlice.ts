import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface RegistrationData {
  email: string
  phone: string
  password: string
  consented: boolean
}

export enum RegistrationStatus {
  Idle,
  InProgress
}

type RegistrationState = {
  data: RegistrationData
  status: RegistrationStatus
}

let initialState: RegistrationState = {
  data: {
    email: '',
    phone: '',
    password: '',
    consented: false
  },
  status: RegistrationStatus.Idle
}

export interface SignupError {
  message: string
  errors: any
}

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setRegistrationData (state, action: PayloadAction<RegistrationData>) {
      state.data = action.payload
    },
    signupStarted (state, action: PayloadAction<void>) {
      state.status = RegistrationStatus.InProgress
    },
    signupSucceeded (state, action: PayloadAction<any>) {
      console.debug('signupSucceeded', action.payload)
      state.status = RegistrationStatus.Idle
    },
    signupFailed (state, action: PayloadAction<SignupError>) {
      console.debug('signupFailed', action.payload)
      state.status = RegistrationStatus.Idle
    }
  }
})

export const {
  setRegistrationData,
  signupStarted,
  signupSucceeded,
  signupFailed
} = registerSlice.actions

export default registerSlice.reducer
