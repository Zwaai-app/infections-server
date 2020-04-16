import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import i18n from './i18n'

// tslint:disable-next-line: no-floating-promises
i18n.changeLanguage('nl-NL')

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
