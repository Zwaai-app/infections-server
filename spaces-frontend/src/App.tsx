import React from 'react'
import logo from './logo.png'
import './App.css'
import 'semantic-ui-css/semantic.min.css'
import { Button } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

function App() {
  const { t } = useTranslation()
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button>{t('home.register', 'Registreren')}</Button>
      </header>
    </div>
  )
}

export default App
