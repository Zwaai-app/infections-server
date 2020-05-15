import profileReducer, {
  ProfileState,
  loadProfile,
  profileLoaded,
  isCompleteProfile,
  updateProfile,
  storeProfileFailed,
  ProfileData,
  profileLoadFailed,
  storeProfileSucceeded,
  storeProfileStarted
} from './profileSlice'
import { SyncStatus } from '../utils/syncStatus'

const orgData = {
  organizationName: 'my org',
  organizationUrl: 'http://example.com',
  phone: '088-1234567',
  logo: 'data:image/png;base64,...'
}
const filledState = profileState({ data: orgData })

it('knows whether a data structure forms a complete profile', () => {
  const incomplete = {
    organizationName: 'my org',
    phone: '088-1234567'
  }
  expect(isCompleteProfile(orgData)).toBeTruthy()
  expect(isCompleteProfile(incomplete)).toBeFalsy()
})

describe('load profile', () => {
  it('does not alter profile when starting load', () => {
    expect(profileReducer(filledState, loadProfile())).toBe(filledState)
  })

  it('changes profile when new values come in', () => {
    const state = profileState()
    expect(profileReducer(state, profileLoaded(orgData))).toEqual(filledState)
  })

  it('clears load error when starting new load', () => {
    const state = profileState({ loadError: 'error' })
    expect(profileReducer(state, loadProfile()).loadError).toBeNull()
  })

  it('stores load errors', () => {
    const state = profileState()
    expect(
      profileReducer(state, profileLoadFailed({ message: 'some error' }))
        .loadError
    ).toEqual('some error')
  })
})

describe('update profile', () => {
  it('can update a profile', () => {
    const state = profileState()
    expect(profileReducer(state, updateProfile(orgData)).data).toEqual(orgData)
  })

  it('clears update error when starting update', () => {
    const state = profileState({ updateStatus: { error: 'error' } })
    expect(profileReducer(state, updateProfile(orgData)).updateStatus).toEqual(
      'idle'
    )
  })

  it('sets status to in progress when starting store', () => {
    const state = profileState({ updateStatus: 'idle' })
    expect(profileReducer(state, storeProfileStarted()).updateStatus).toEqual(
      'inProgress'
    )
  })

  it('updates status when store succeeds', () => {
    const state = profileState({ updateStatus: 'inProgress' })
    expect(profileReducer(state, storeProfileSucceeded()).updateStatus).toEqual(
      'success'
    )
  })

  it('stores update profile errors', () => {
    const state = profileState()
    expect(
      profileReducer(state, storeProfileFailed({ message: 'some error' }))
        .updateStatus
    ).toEqual({ error: 'some error' })
  })
})

function profileState ({
  data,
  loadError,
  updateStatus
}: {
  data?: ProfileData | null
  loadError?: string | null
  updateStatus?: SyncStatus
} = {}): ProfileState {
  return {
    data: data || null,
    loadError: loadError || null,
    updateStatus: updateStatus || 'idle'
  }
}
