import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getStructEq, eqString, eqBoolean } from 'fp-ts/lib/Eq'

export interface RegistrationData {
  email: string
  phone: string
  password: string
  consented: boolean
}

export const registrationDataEq = getStructEq({
  email: eqString,
  phone: eqString,
  password: eqString,
  consented: eqBoolean
})

export enum RegistrationStatus {
  Idle,
  InProgress,
  Success,
  Failed
}

export type RegistrationState = {
  status: RegistrationStatus
}

export const initialState: RegistrationState = {
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
    // tslint:disable-next-line: no-empty
    startRegistration (_state, _action: PayloadAction<RegistrationData>) {},
    signupStarted (state, _action: PayloadAction<void>) {
      state.status = RegistrationStatus.InProgress
    },
    signupSucceeded (state, _action: PayloadAction<any>) {
      state.status = RegistrationStatus.Success
    },
    signupFailed (state, _action: PayloadAction<SignupError>) {
      state.status = RegistrationStatus.Failed
    }
  }
})

export type StartRegistrationAction = ReturnType<typeof startRegistration>
export type SignupSucceededAction = ReturnType<typeof signupSucceeded>

export const {
  startRegistration,
  signupStarted,
  signupSucceeded,
  signupFailed
} = registerSlice.actions

export default registerSlice.reducer
