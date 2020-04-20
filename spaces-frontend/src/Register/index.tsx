import React from 'react'
import { Container } from 'semantic-ui-react'
import { t } from '../i18n'
import { DataEntry } from './DataEntry'

export function Register() {
  return (
    <div className="Register">
      <Container>
        <h1>{t('register.registerNewAccount', 'Nieuw account registreren')}</h1>
        <DataEntry />
      </Container>
    </div>
  )
}
