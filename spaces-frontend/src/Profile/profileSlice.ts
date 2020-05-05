import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { parseURL, URLRecord } from 'whatwg-url'
import * as R from 'rambda'

type DataUrl = string

export interface ProfileData {
  organizationName: string
  organizationUrl: URLRecord
  phone: string
  logo: DataUrl
}

const dummyUrl = parseURL('https://example.com')!

export const isCompleteProfile = (data: object | null): boolean => {
  if (!data) return false

  const dummyProfile: ProfileData = {
    organizationName: 'dummy',
    organizationUrl: dummyUrl,
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
    // tslint:disable-next-line: no-empty
    loadProfile (_state, _action: PayloadAction<void>) {},
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
    updateProfileSucceeded (_state, _action: PayloadAction<void>) {},
    updateProfileFailed (state, action: PayloadAction<string>) {
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
  updateProfileSucceeded,
  updateProfileFailed
} = profileSlice.actions

export default profileSlice.reducer
