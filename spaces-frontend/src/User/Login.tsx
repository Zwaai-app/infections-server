import React from 'react'
import { Form, Button, Input } from 'semantic-ui-react'
import { t } from '../i18n'

export const Login = () => {
  return <div id='Login'>
    <h1>{t('login.header', 'Inloggen')}</h1>
    <Form>
      <Form.Field>
        <label>{t('login.usernameLabel', 'E-mailadres')}</label>
        <Input
          label='@'
          name='email'
          autoComplete='username'
          placeholder={t('login.usernamePlaceholder', 'e-mailadres')} />
      </Form.Field>
      <Form.Input
        label={t('login.passwordLabel', 'Wachtwoord')}
        name='password'
        autoComplete='password'
        type='password'
        placeholder={t('login.passwordPlaceholder', 'wachtwoord')} />
      <Form.Field>
        <Button
          className="right floated"
          primary
          disabled
        >{t('login.loginButton', 'Inloggen')}</Button>
      </Form.Field>
    </Form>
  </div>
}
