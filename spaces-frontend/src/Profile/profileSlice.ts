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
}

const initialState: ProfileState = { data: null, loadError: null }

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // tslint:disable-next-line: no-empty
    loadProfile (state, action: PayloadAction<void>) {},
    profileLoaded (state, action: PayloadAction<ProfileData>) {
      state.data = action.payload
    },
    profileLoadFailed (state, action: PayloadAction<string>) {
      state.loadError = action.payload
    },
    updateProfile (state, action: PayloadAction<ProfileData>) {
      state.data = action.payload
    }
  }
})

export type LoadProfileAction = ReturnType<typeof loadProfile>

export const {
  loadProfile,
  profileLoaded,
  profileLoadFailed,
  updateProfile
} = profileSlice.actions

export default profileSlice.reducer
