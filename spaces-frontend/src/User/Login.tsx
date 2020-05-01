import React, { useState, useEffect } from 'react'
import { Form, Button, Input, Message } from 'semantic-ui-react'
import { t } from '../i18n'
import { useDispatch, useSelector } from 'react-redux'
import { login, isLoginError } from './userSlice'
import { RootState } from '../rootReducer'
import { useHistory } from 'react-router-dom'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const loginStatus = useSelector((state: RootState) => state.user.status)
  const history = useHistory()

  useEffect(() => {
    if (loginStatus === 'loggedIn') {
      history.replace('/')
    }
  })
  return <div id='Login'>
    <h1>{t('login.header', 'Inloggen')}</h1>
    <Form error={isLoginError(loginStatus)}>
      <Form.Field>
        <label>{t('login.usernameLabel', 'E-mailadres')}</label>
        <Input
          label='@'
          name='email'
          value={email}
          onChange={(_, { value }) => setEmail(value)}
          autoComplete='username'
          placeholder={t('login.usernamePlaceholder', 'e-mailadres')} />
      </Form.Field>
      <Form.Input
        label={t('login.passwordLabel', 'Wachtwoord')}
        name='password'
        value={password}
        onChange={(_, { value }) => setPassword(value)}
        autoComplete='password'
        type='password'
        placeholder={t('login.passwordPlaceholder', 'wachtwoord')} />
      <Message
        error
        content={t(
          'login.failed',
          'Ingeldige gebruikersnaam of wachtwoord'
        )}
      />
      <Form.Field>
        <Button
          className="right floated"
          primary
          loading={loginStatus === 'loggingIn'}
          disabled={!email || !password || loginStatus === 'loggingIn'}
          onClick={() => dispatch(login({ username: email, password }))}
        >{t('login.loginButton', 'Inloggen')}</Button>
      </Form.Field>
    </Form>
  </div>
}
