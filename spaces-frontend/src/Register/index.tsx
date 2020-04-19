import React from 'react'
import { Container } from 'semantic-ui-react'
import { t } from '../i18n'
import { Steps } from './Steps'
import { DataEntry } from './DataEntry'
import { RootState } from '../rootReducer'
import { useSelector } from 'react-redux'

export function Register() {
  const step = useSelector((state: RootState) => state.register.step)
  return (
    <div className="Register">
      <Container>
        <h1>{t('register.registerNewAccount', 'Nieuw account registreren')}</h1>
        <Steps current={step} />
        <DataEntry />
      </Container>
    </div>
  )
}
