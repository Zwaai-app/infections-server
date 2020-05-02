import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as R from 'ramda'

interface ProfileData {
  organizationName: string
  organizationUrl: string
}

export const isCompleteProfile = (data: object | null): boolean => {
  if (!data) return false

  const dummyProfile: ProfileData = {
    organizationName: 'dummy',
    organizationUrl: 'dummy',
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
    }
  }
})

export type LoadProfileAction = ReturnType<typeof loadProfile>

export const {
  loadProfile,
  profileLoaded,
  profileLoadFailed
} = profileSlice.actions

export default profileSlice.reducer
