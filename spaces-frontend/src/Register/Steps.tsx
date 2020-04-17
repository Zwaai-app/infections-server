import React from 'react'
import { Step, Icon } from 'semantic-ui-react'
import { t } from '../i18n'

export const Steps = () => (
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
        <Step.Title>{t('register.stepConfirmTitle', 'Bevestiging')}</Step.Title>
      </Step.Content>
    </Step>
  </Step.Group>
)
