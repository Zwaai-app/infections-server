import profileReducer, {
  ProfileState,
  loadProfile,
  profileLoaded,
  isCompleteProfile
} from './profileSlice'
import { parseURL } from 'whatwg-url'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const orgData = {
  organizationName: 'my org',
  organizationUrl: parseURL('http://example.com')!,
  phone: parsePhoneNumberFromString('088-1234567', 'NL')!,
  logo: 'data:image/png;base64,...'
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
  expect(isCompleteProfile(orgData)).toBeTruthy()
  expect(isCompleteProfile(incomplete)).toBeFalsy()
})
