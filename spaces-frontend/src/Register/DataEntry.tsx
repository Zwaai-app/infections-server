import React, { useState } from 'react'
import { Form, Input, Button, Message } from 'semantic-ui-react'
import { t } from '../i18n'
import { History } from 'history'
import { useHistory } from 'react-router-dom'
import {
  Either,
  left,
  right,
  isLeft,
  map,
  getValidation,
  getOrElse,
} from 'fp-ts/lib/Either'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import { pipe } from 'fp-ts/lib/pipeable'
import { sequenceT } from 'fp-ts/lib/Apply'
import { identity } from 'fp-ts/lib/function'
import { lift, lift2 } from '../EitherUtils'

const tPasswordsDiffer = t(
  'registration.passwordsDiffer',
  'Wachtwoorden zijn niet hetzelfde'
)

const tPasswordLength = t(
  'registration.passwordMinimalLength',
  'tenminste 8 karakters'
)

const tPasswordOneCapital = t(
  'registration.passwordOneCapital',
  'tenminste een hoofdletter'
)

const tPasswordOneNumber = t(
  'registration.passwordOneNumber',
  'tenminste een cijfer'
)

const equalPasswords = (p1: string, p2: string): Either<string, string> =>
  p1 === p2 ? right(p1) : left(tPasswordsDiffer)

const minLength = (s: string): Either<string, string> =>
  s.length >= 8 ? right(s) : left(tPasswordLength)

const oneCapital = (s: string): Either<string, string> =>
  /[A-Z]/g.test(s) ? right(s) : left(tPasswordOneCapital)

const oneNumber = (s: string): Either<string, string> =>
  /[0-9]/g.test(s) ? right(s) : left(tPasswordOneNumber)

const minLengthV = lift(minLength)
const oneCapitalV = lift(oneCapital)
const oneNumberV = lift(oneNumber)
const equalPasswordsV = lift2(equalPasswords)

function validatePassword(
  p1: string,
  p2: string
): Either<NEA.NonEmptyArray<string>, string[]> {
  return pipe(
    sequenceT(getValidation(NEA.getSemigroup<string>()))(
      minLengthV(p1),
      oneCapitalV(p1),
      oneNumberV(p1),
      equalPasswordsV(p1, p2)
    ),
    map(() => [])
  )
}

export const DataEntry = () => {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const passwordsSame = equalPasswords(password1, password2)
  const pwdValid: Either<
    NEA.NonEmptyArray<string>,
    string[]
  > = validatePassword(password1, password2)
  const errors: string[] = getOrElse(identity)(pwdValid)
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>{t('register.phone', 'Mobiel nummer')}</label>
          <Input
            label="+31 (0)6"
            placeholder={t('register.phonePlaceholder', '12345678')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Form.Field>
        <Form.Input
          label={t('register.password1', 'Wachtwoord')}
          type="password"
          placeholder={t('register.password1', 'Wachtwoord')}
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          error={isLeft(passwordsSame)}
        />
        <Form.Input
          label={t('register.password2', 'Wachtwoord nogmaals')}
          type="password"
          placeholder={t('register.password2', 'Wachtwoord nogmaals')}
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          error={isLeft(passwordsSame)}
        />
        <Message
          error
          header={t('registration.passwordInvalid', 'Wachtwoord is ongeldig')}
          list={errors}
        />
        <Form.Checkbox
          label={t('register.agree', 'Ik ga akkoord met de voorwaarden')}
        />
        <Form.Field>
          <Button
            className="right floated"
            icon="chevron right"
            labelPosition="right"
            primary
            disabled
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
