import React, { useState, useEffect } from 'react'
import { Form, Button, Input } from 'semantic-ui-react'
import { t } from '../i18n'
import { useDispatch, useSelector } from 'react-redux'
import { login } from './userSlice'
import { RootState } from '../rootReducer'
import { useHistory } from 'react-router-dom'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const loggedIn = useSelector((state: RootState) => state.user.loggedIn)
  const history = useHistory()

  useEffect(() => {
    if (loggedIn) {
      history.replace('/')
    }
  })
  return <div id='Login'>
    <h1>{t('login.header', 'Inloggen')}</h1>
    <Form>
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
      <Form.Field>
        <Button
          className="right floated"
          primary
          disabled={!email || !password}
          onClick={() => dispatch(login({ username: email, password }))}
        >{t('login.loginButton', 'Inloggen')}</Button>
      </Form.Field>
    </Form>
  </div>
}
