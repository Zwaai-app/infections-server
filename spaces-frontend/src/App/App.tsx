import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Home } from '../Home/Home'
import { Register } from '../Register/Register'
import { Topbar } from '../Topbar/Topbar'
import './App.css'

function App() {
  return (
    <div className="App">
      <Router>
        <Topbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/register" component={Register} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
