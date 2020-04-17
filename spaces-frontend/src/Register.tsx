import React from 'react'
import { Form, Container, Input, Button, Step, Icon } from 'semantic-ui-react'
import { t } from './i18n'
import { History } from 'history'

interface RegisterProps {
  history?: History
}

export const Register = ({ history }: RegisterProps) => (
  <div className="Register">
    <Container>
      <h1>{t('register.registerNewAccount', 'Nieuw account registreren')}</h1>
      <Step.Group fluid>
        <Step>
          <Icon name="edit" />
          <Step.Content>
            <Step.Title>{t('register.stepDataTitle', 'Gegevens')}</Step.Title>
            <Step.Description>
              {t('register.stepDataDesc', 'Uw accountgegevens')}
            </Step.Description>
          </Step.Content>
        </Step>
        <Step disabled>
          <Icon name="euro" />
          <Step.Content>
            <Step.Title>{t('register.stepPayTitle', 'Betaling')}</Step.Title>
            <Step.Description>
              {t('register.stepPayDesc', 'Betaal registratiekosten')}
            </Step.Description>
          </Step.Content>
        </Step>
        <Step disabled>
          <Icon name="info circle" />
          <Step.Content>
            <Step.Title>
              {t('register.stepConfirmTitle', 'Bevestiging')}
            </Step.Title>
          </Step.Content>
        </Step>
      </Step.Group>
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
    </Container>
  </div>
)
