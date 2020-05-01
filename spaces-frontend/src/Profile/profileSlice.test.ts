import profileReducer, {
  ProfileState,
  loadProfile,
  profileLoaded
} from './profileSlice'

const orgData = {
  organizationName: 'my org',
  organizationUrl: 'http://example.com'
}
const filledState: ProfileState = { data: orgData, loadError: null }

it('does not alter profile when starting load', () => {
  expect(profileReducer(filledState, loadProfile())).toBe(filledState)
})

it('changes profile when new values come in', () => {
  const state: ProfileState = { data: null, loadError: null }
  expect(profileReducer(state, profileLoaded(orgData))).toEqual(filledState)
})
