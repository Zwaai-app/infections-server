import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as R from 'rambda'

type DataUrl = string

export interface ProfileData {
  organizationName: string
  organizationUrl: string
  phone: string
  logo: DataUrl
}

export const isCompleteProfile = (data: object | null): boolean => {
  if (!data) return false

  const dummyProfile: ProfileData = {
    organizationName: 'dummy',
    organizationUrl: 'dummy',
    phone: 'dummy',
    logo: ''
  }

  // Verify that data overwrites all properties of `dummyProfile`.
  // This way the compiler will tell us when we add new fields to
  // `ProfileData` and forget to add them in this function.
  return R.equals({ ...dummyProfile, ...data }, data)
}

export type ProfileState = {
  data: ProfileData | null
  loadError: string | null
  updateError: string | null
}

const initialState: ProfileState = {
  data: null,
  loadError: null,
  updateError: null
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    loadProfile (state, _action: PayloadAction<void>) {
      state.loadError = null
    },
    profileLoaded (state, action: PayloadAction<ProfileData>) {
      state.data = action.payload
    },
    profileLoadFailed (state, action: PayloadAction<string>) {
      state.loadError = action.payload
    },
    updateProfile (state, action: PayloadAction<ProfileData>) {
      state.data = action.payload
      state.updateError = null
    },
    // tslint:disable-next-line: no-empty
    storeProfileSucceeded (_state, _action: PayloadAction<void>) {},
    storeProfileFailed (state, action: PayloadAction<string>) {
      state.updateError = action.payload
    }
  }
})

export type LoadProfileAction = ReturnType<typeof loadProfile>
export type UpdateProfileAction = ReturnType<typeof updateProfile>

export const {
  loadProfile,
  profileLoaded,
  profileLoadFailed,
  updateProfile,
  storeProfileSucceeded,
  storeProfileFailed
} = profileSlice.actions

export default profileSlice.reducer
