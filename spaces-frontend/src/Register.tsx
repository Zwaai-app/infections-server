import React from 'react'
import { Form, Container, Input, Button, Icon } from 'semantic-ui-react'
import { t } from './i18n'
import { History } from 'history'

interface RegisterProps {
  history?: History
}

export const Register = ({ history }: RegisterProps) => (
  <div className="Register">
    <Container>
      <h1>{t('register.registerNewAccount', 'Nieuw account registreren')}</h1>
      <p>
        {t('register.intro', 'Alle velden moeten verplicht ingevuld worden.')}
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
          label={t('register.agree', 'Ik stem in met de voorwaarden')}
        />
        <Form.Field>
          <Button className="right floated" primary disabled>
            {t('register.register', 'Registreer')}
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
    </Container>
  </div>
)
