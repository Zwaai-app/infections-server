import reducer, {
  UserState,
  logout,
  loginSucceeded,
  loginFailed,
  login
} from './userSlice'

const credentials = { username: 'foo', password: 'bar' }

it('sets in progress when starting new login', () => {
  const state: UserState = { status: 'loggedOut', email: '' }
  const newState = reducer(state, login(credentials))
  expect(newState.status).toEqual('loggingIn')
})

it('sets loggedIn and email when login succeeds', () => {
  const state: UserState = { status: 'loggingIn', email: 'foo@bar.com' }
  const newState = reducer(state, loginSucceeded())
  expect(newState.status).toEqual('loggedIn')
  expect(newState.email).toEqual('foo@bar.com')
})

it('clears loggedIn and email on login error', () => {
  const state: UserState = { status: 'loggingIn', email: 'foo@bar.com' }
  const errorMessage = 'some error message'
  const newState = reducer(state, loginFailed({ message: errorMessage }))
  expect(newState.status).toEqual({ error: 'some error message' })
  expect(newState.email).toEqual('')
})

it('clears loggedIn and email on logout', () => {
  const state: UserState = { status: 'loggedIn', email: 'foo@bar.com' }
  const newState = reducer(state, logout())
  expect(newState.status).toEqual('loggedOut')
  expect(newState.email).toEqual('')
})
