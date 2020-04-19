import React, { useState } from 'react'
import { Form, Input, Button, Message } from 'semantic-ui-react'
import { t } from '../i18n'
import { History } from 'history'
import { useHistory } from 'react-router-dom'
import { Either, isLeft, fold } from 'fp-ts/lib/Either'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { equalPasswords, validateRegistrationData } from './validation'
import { RegistrationData } from './registerSlice'

export const DataEntry = () => {
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
  let errors: string[] = []
  let registrationData: RegistrationData | null = null
  fold(
    (ers: string[]) => {
      errors = ers
    },
    (reg: RegistrationData) => {
      registrationData = reg
    }
  )(validationResult)
  return (
    <div>
      <p>
        {t(
          'register.intro',
          'Het registreren van een nieuw account kost €25,-. Na het ' +
            'invullen van onderstaand formulier komt u op een pagina ' +
            'waar de betaling gedaan kan worden.'
        )}
      </p>
      <p>
        {t(
          'register.required',
          'Alle velden moeten verplicht ingevuld worden.'
        )}
      </p>
      <Form error={errors.length > 0}>
        <Form.Field>
          <label>{t('register.email', 'E-mail adres')}</label>
          <Input
            label="@"
            placeholder={t('register.email', 'E-mail adres')}
            value={email}
            onChange={(_, { value }) => setEmail(value)}
          />
        </Form.Field>
        <Form.Field>
          <label>{t('register.phone', 'Mobiel nummer')}</label>
          <Input
            label="+31 (0)6"
            placeholder={t('register.phonePlaceholder', '12345678')}
            value={phone}
            onChange={(_, { value }) => setPhone(value)}
          />
        </Form.Field>
        <Form.Input
          label={t('register.password1', 'Wachtwoord')}
          type="password"
          placeholder={t('register.password1', 'Wachtwoord')}
          value={password1}
          onChange={(_, { value }) => setPassword1(value)}
          error={isLeft(passwordsSame)}
        />
        <Form.Input
          label={t('register.password2', 'Wachtwoord nogmaals')}
          type="password"
          placeholder={t('register.password2', 'Wachtwoord nogmaals')}
          value={password2}
          onChange={(_, { value }) => setPassword2(value)}
          error={isLeft(passwordsSame)}
        />
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
          list={errors}
        />
        <Form.Field>
          <Button
            className="right floated"
            icon="chevron right"
            labelPosition="right"
            primary
            disabled={!registrationData}
            content={t('register.toPay', 'Naar Betaling')}
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

interface DataEntryProps {
  history?: History
}
