import React, { useState } from 'react'
import { Form, Input, Button, Message } from 'semantic-ui-react'
import { t } from '../i18n'
import { useHistory } from 'react-router-dom'
import { Either, isLeft, map, swap, getOrElse } from 'fp-ts/lib/Either'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { equalPasswords, validateRegistrationData } from './validation'
import { RegistrationData, setRegistrationData } from './registerSlice'
import { useDispatch } from 'react-redux'
import { constant } from 'fp-ts/lib/function'

export const DataEntry = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [consent, setConsent] = useState(false)
  const passwordsSame = equalPasswords(password1, password2)
  const validationResult: Either<
    NonEmptyArray<string>,
    RegistrationData
  > = validateRegistrationData(email, phone, password1, password2, consent)
  return (
    <div>
      <p>
        {t(
          'register.intro',
          'Na het invullen van onderstaand formulier krijgt u een bevestigingsemail' +
          ' op het opgegeven adres. Klik op de link in de mail om uw account' +
          ' te activeren.'
        )}
      </p>
      <p>
        {t(
          'register.required',
          'Alle velden moeten verplicht ingevuld worden.'
        )}
      </p>
      <Form error={isLeft(validationResult)}>
        <Form.Field>
          <label>{t('register.email', 'E-mail adres')}</label>
          <Input
            label="@"
            name="email"
            autoComplete="username"
            placeholder={t('register.email', 'E-mail adres')}
            value={email}
            onChange={(_, { value }) => setEmail(value)}
          />
        </Form.Field>
        <Form.Field>
          <label>{t('register.phone', 'Mobiel nummer')}</label>
          <Input
            label="+31 (0)6"
            name="mobile"
            autoComplete="tel"
            placeholder={t('register.phonePlaceholder', '12345678')}
            value={phone}
            onChange={(_, { value }) => setPhone(value)}
          />
        </Form.Field>
        <Form.Input
          label={t('register.password1', 'Wachtwoord')}
          type="password"
          autoComplete="new-password"
          placeholder={t('register.password1', 'Wachtwoord')}
          value={password1}
          onChange={(_, { value }) => setPassword1(value)}
          error={isLeft(passwordsSame)}
        >
          <input autoComplete="new-password" />
        </Form.Input>
        <Form.Input
          label={t('register.password2', 'Wachtwoord nogmaals')}
          type="password"
          autoComplete="new-password"
          placeholder={t('register.password2', 'Wachtwoord nogmaals')}
          value={password2}
          onChange={(_, { value }) => setPassword2(value)}
          error={isLeft(passwordsSame)}
        >
          <input autoComplete="new-password" />
        </Form.Input>
        <Form.Checkbox
          label={t('register.agree', 'Ik ga akkoord met de voorwaarden')}
          checked={consent}
          onChange={(_, { checked }) => setConsent(checked || false)}
        />
        <Message
          error
          header={t(
            'registration.formErrors',
            'Het formulier is niet goed ingevuld'
          )}
          list={getOrElse(constant([] as string[]))(swap(validationResult))}
        />
        <Form.Field>
          <Button
            className="right floated"
            primary
            disabled={isLeft(validationResult)}
            content={t('register.finish', 'Registreer')}
            onClick={() => {
              map((reg: RegistrationData) =>
                dispatch(setRegistrationData(reg))
              )(validationResult)
            }}
          />
          <Button
            className="right floated"
            secondary
            onClick={() => history?.push('/')}
            content={t('register.cancel', 'Annuleer')}
          />
        </Form.Field>
      </Form>
    </div>
  )
}
