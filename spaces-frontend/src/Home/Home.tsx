import React from 'react'
import logo from './logo.png'
import './Home.css'
import { Button } from 'semantic-ui-react'
import { t } from '../i18n'
import { History } from 'history'

export const Home = ({ history }: HomeProps) => {
  return (
    <div className="Home">
      <header className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <Button onClick={() => history?.push('/register')}>
          {t('home.register', 'Registreren')}
        </Button>
      </header>
    </div>
  )
}

interface HomeProps {
  history?: History
}
