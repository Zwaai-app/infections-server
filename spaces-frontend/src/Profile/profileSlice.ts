import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProfileData {
  organizationName: string
  organizationUrl: string
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
