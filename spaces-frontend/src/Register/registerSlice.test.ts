import reducer, {
  RegistrationStatus,
  RegistrationState,
  signupSucceeded,
  initialState
} from './registerSlice'

it('clears registration data after registration succeeds', () => {
  const state: RegistrationState = {
    data: {
      email: 'foo@bar.com',
      phone: '12345678',
      password: 'Welcome123',
      consented: true
    },
    status: RegistrationStatus.InProgress
  }
  const newState = reducer(state, signupSucceeded({}))
  expect(newState.data).toEqual(initialState.data)
})
