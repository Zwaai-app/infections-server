import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Provider } from 'react-redux'
import store from './store'

const render = () => {
  const App = require('./App/App').default
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

render()

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App/App', render)
}
