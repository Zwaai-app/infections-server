import reducer, {
  UserState,
  logout,
  loginSucceeded,
  loginFailed,
  login
} from './userSlice'

const credentials = { username: 'foo', password: 'bar' }

it('clears loggedIn when starting new login', () => {
  const state: UserState = { loggedIn: true }
  const newState = reducer(state, login(credentials))
  expect(newState.loggedIn).toBeFalsy()
})

it('sets loggedIn when login succeeds', () => {
  const state: UserState = { loggedIn: false }
  const newState = reducer(state, loginSucceeded())
  expect(newState.loggedIn).toBeTruthy()
})

it('clears loggedIn on login error', () => {
  const state: UserState = { loggedIn: true }
  const newState = reducer(state, loginFailed(new Error()))
  expect(newState.loggedIn).toBeFalsy()
})

it('clears loggedIn on logout', () => {
  const state: UserState = { loggedIn: true }
  const newState = reducer(state, logout())
  expect(newState.loggedIn).toBeFalsy()
})
