import React from 'react'
import { Form, Input, Button } from 'semantic-ui-react'
import { t } from '../i18n'
import { History } from 'history'

export const DataEntry = ({ history }: DataEntryProps) => (
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
      {t('register.required', 'Alle velden moeten verplicht ingevuld worden.')}
    </p>
    <Form>
      <Form.Field>
        <label>{t('register.email', 'E-mail adres')}</label>
        <Input label="@" placeholder={t('register.email', 'E-mail adres')} />
      </Form.Field>
      <Form.Field>
        <label>{t('register.phone', 'Mobiel nummer')}</label>
        <Input
          label="+31 (0)6"
          placeholder={t('register.phonePlaceholder', '12345678')}
        />
      </Form.Field>
      <Form.Field>
        <label>{t('register.password1', 'Wachtwoord')}</label>
        <Input
          type="password"
          placeholder={t('register.password1', 'Wachtwoord')}
        />
      </Form.Field>
      <Form.Field>
        <label>{t('register.password2', 'Wachtwoord nogmaals')}</label>
        <Input
          type="password"
          placeholder={t('register.password2', 'Wachtwoord nogmaals')}
        />
      </Form.Field>
      <Form.Checkbox
        label={t('register.agree', 'Ik ga akkoord met de voorwaarden')}
      />
      <Form.Field>
        <Button className="right floated" primary disabled>
          {t('register.toPay', 'Naar Betaling')}
        </Button>
        <Button
          className="right floated"
          secondary
          onClick={() => history?.push('/')}
        >
          {t('register.cancel', 'Annuleer')}
        </Button>
      </Form.Field>
    </Form>
  </div>
)

interface DataEntryProps {
  history?: History
}
