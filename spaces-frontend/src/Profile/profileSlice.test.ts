import profileReducer, {
  ProfileState,
  loadProfile,
  profileLoaded,
  isCompleteProfile,
  updateProfile,
  updateProfileFailed,
  ProfileData
} from './profileSlice'
import { parseURL } from 'whatwg-url'

const orgData = {
  organizationName: 'my org',
  organizationUrl: parseURL('http://example.com')!,
  phone: '088-1234567',
  logo: 'data:image/png;base64,...'
}
const filledState = profileState({ data: orgData })

it('does not alter profile when starting load', () => {
  expect(profileReducer(filledState, loadProfile())).toBe(filledState)
})

it('changes profile when new values come in', () => {
  const state = profileState()
  expect(profileReducer(state, profileLoaded(orgData))).toEqual(filledState)
})

it('knows whether a data structure forms a complete profile', () => {
  const incomplete = {
    organizationName: 'my org',
    phone: '088-1234567'
  }
  expect(isCompleteProfile(orgData)).toBeTruthy()
  expect(isCompleteProfile(incomplete)).toBeFalsy()
})

it('can update a profile', () => {
  const state = profileState()
  expect(profileReducer(state, updateProfile(orgData)).data).toEqual(orgData)
})

it('clears update error when starting update', () => {
  const state = profileState({ updateError: 'error' })
  expect(profileReducer(state, updateProfile(orgData)).updateError).toBeNull()
})

it('stores update profile errors', () => {
  const state = profileState()
  expect(
    profileReducer(state, updateProfileFailed('error')).updateError
  ).toEqual('error')
})

function profileState ({
  data,
  loadError,
  updateError
}: {
  data?: ProfileData | null
  loadError?: string | null
  updateError?: string | null
} = {}): ProfileState {
  return {
    data: data || null,
    loadError: loadError || null,
    updateError: updateError || null
  }
}
