import profileReducer, {
  ProfileState,
  loadProfile,
  profileLoaded,
  isCompleteProfile,
  ProfileData
} from './profileSlice'

const orgData = {
  organizationName: 'my org',
  organizationUrl: 'http://example.com',
  phone: '088-1234567'
}
const filledState: ProfileState = { data: orgData, loadError: null }

it('does not alter profile when starting load', () => {
  expect(profileReducer(filledState, loadProfile())).toBe(filledState)
})

it('changes profile when new values come in', () => {
  const state: ProfileState = { data: null, loadError: null }
  expect(profileReducer(state, profileLoaded(orgData))).toEqual(filledState)
})

it('knows whether a data structure forms a complete profile', () => {
  const incomplete = {
    organizationName: 'my org',
    phone: '088-1234567'
  }
  const dummyProfile: ProfileData = {
    organizationName: 'dummy',
    organizationUrl: 'dummy',
    phone: 'dummy'
  }
  expect(isCompleteProfile(orgData)).toBeTruthy()
  expect(isCompleteProfile(incomplete)).toBeFalsy()
})
