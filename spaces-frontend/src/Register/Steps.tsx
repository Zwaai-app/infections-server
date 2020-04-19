import React from 'react'
import { Step, Icon } from 'semantic-ui-react'
import { t } from '../i18n'
import { RegistrationStep } from './registerSlice'

export const Steps = (prop: { current: RegistrationStep }) => (
  <Step.Group fluid>
    <Step active={prop.current === 'data'}>
      <Icon name="edit" />
      <Step.Content>
        <Step.Title>{t('register.stepDataTitle', 'Gegevens')}</Step.Title>
        <Step.Description>
          {t('register.stepDataDesc', 'Uw accountgegevens')}
        </Step.Description>
      </Step.Content>
    </Step>
    <Step
      active={prop.current === 'payment'}
      disabled={prop.current === 'data'}
    >
      <Icon name="euro" />
      <Step.Content>
        <Step.Title>{t('register.stepPayTitle', 'Betaling')}</Step.Title>
        <Step.Description>
          {t('register.stepPayDesc', 'Betaal registratiekosten')}
        </Step.Description>
      </Step.Content>
    </Step>
    <Step
      active={prop.current === 'confirmation'}
      disabled={prop.current !== 'confirmation'}
    >
      <Icon name="info circle" />
      <Step.Content>
        <Step.Title>{t('register.stepConfirmTitle', 'Bevestiging')}</Step.Title>
      </Step.Content>
    </Step>
  </Step.Group>
)
