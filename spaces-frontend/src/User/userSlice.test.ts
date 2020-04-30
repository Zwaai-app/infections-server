import reducer, { UserState, logout } from './userSlice'

it('clears token on logout', () => {
  const state: UserState = { token: 'some token' }
  const newState = reducer(state, logout())
  expect(newState.token).toBeNull()
})
