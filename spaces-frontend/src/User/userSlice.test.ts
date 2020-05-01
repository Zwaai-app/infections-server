import reducer, {
  UserState,
  logout,
  loginSucceeded,
  loginFailed,
  login
} from './userSlice'

const credentials = { username: 'foo', password: 'bar' }

it('clears loggedIn when starting new login', () => {
  const state: UserState = { status: 'loggedIn' }
  const newState = reducer(state, login(credentials))
  expect(newState.status).toEqual('loggedOut')
})

it('sets loggedIn when login succeeds', () => {
  const state: UserState = { status: 'loggedOut' }
  const newState = reducer(state, loginSucceeded())
  expect(newState.status).toEqual('loggedIn')
})

it('clears loggedIn on login error', () => {
  const state: UserState = { status: 'loggedIn' }
  const errorMessage = 'some error message'
  const newState = reducer(state, loginFailed(errorMessage))
  expect(newState.status).toEqual({ error: 'some error message' })
})

it('clears loggedIn on logout', () => {
  const state: UserState = { status: 'loggedIn' }
  const newState = reducer(state, logout())
  expect(newState.status).toEqual('loggedOut')
})
