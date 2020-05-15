import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface RegistrationData {
  email: string
  phone: string
  password: string
  consented: boolean
}

export enum RegistrationStatus {
  Idle,
  InProgress,
  Success,
  Failed
}

export type RegistrationState = {
  data: RegistrationData
  status: RegistrationStatus
}

export const initialState: RegistrationState = {
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
    signupStarted (state, _action: PayloadAction<void>) {
      state.status = RegistrationStatus.InProgress
    },
    signupSucceeded (state, _action: PayloadAction<any>) {
      state.status = RegistrationStatus.Success
      state.data = initialState.data
    },
    signupFailed (state, _action: PayloadAction<SignupError>) {
      state.status = RegistrationStatus.Failed
    }
  }
})

export type SetRegistrationDataAction = ReturnType<typeof setRegistrationData>
export type SignupSucceededAction = ReturnType<typeof signupSucceeded>

export const {
  setRegistrationData,
  signupStarted,
  signupSucceeded,
  signupFailed
} = registerSlice.actions

export default registerSlice.reducer
