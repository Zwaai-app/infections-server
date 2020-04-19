import React from 'react'
import { Container } from 'semantic-ui-react'
import { t } from '../i18n'
import { Steps } from './Steps'
import { DataEntry } from './DataEntry'
import { RootState } from '../rootReducer'
import { useSelector } from 'react-redux'
import { RegistrationStep } from './registerSlice'

function fragmentFor(step: RegistrationStep): React.ReactFragment {
  switch (step) {
    case 'data':
      return <DataEntry />
    case 'payment':
      return <p>PAYMENT</p>
    case 'confirmation':
      return <p>CONFIRMATION</p>
  }
}

export function Register() {
  const step = useSelector((state: RootState) => state.register.step)
  return (
    <div className="Register">
      <Container>
        <h1>{t('register.registerNewAccount', 'Nieuw account registreren')}</h1>
        <Steps current={step} />
        {fragmentFor(step)}
      </Container>
    </div>
  )
}
