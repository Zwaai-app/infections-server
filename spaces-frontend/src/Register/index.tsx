import React from 'react'
import { Container } from 'semantic-ui-react'
import { t } from '../i18n'
import { Steps } from './Steps'
import { DataEntry } from './DataEntry'

export const Register = () => (
  <div className="Register">
    <Container>
      <h1>{t('register.registerNewAccount', 'Nieuw account registreren')}</h1>
      <Steps />
      <DataEntry />
    </Container>
  </div>
)
