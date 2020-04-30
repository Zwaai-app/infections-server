import reducer, {
  UserState,
  logout,
  loginSucceeded,
  loginFailed,
  LoginCredentials,
  login
} from './userSlice'

const credentials = { username: 'foo', password: 'bar' }

it('clears token when starting new login', () => {
  const state: UserState = { token: 'some token' }
  const newState = reducer(state, login(credentials))
  expect(newState.token).toBeNull()
})

it('stores the token when login succeeds', () => {
  const state: UserState = { token: null }
  const newState = reducer(state, loginSucceeded('some token'))
  expect(newState.token).toBe('some token')
})

it('clears the token on login error', () => {
  const state: UserState = { token: 'some token' }
  const newState = reducer(state, loginFailed(new Error()))
  expect(newState.token).toBeNull()
})

it('clears token on logout', () => {
  const state: UserState = { token: 'some token' }
  const newState = reducer(state, logout())
  expect(newState.token).toBeNull()
})
