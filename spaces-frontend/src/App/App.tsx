import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Home } from '../Home/Home'
import { Register } from '../Register/Register'
import { Login } from '../User/Login'
import { Topbar } from '../Topbar/Topbar'
import './App.css'
import { ScrollToTop } from '../utils/ScrollToTop'
import { Profile } from '../Profile/Profile'

function App() {
  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Topbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path='/login' component={Login} />
          <Route path="/register" component={Register} />
          <Route path='/profile' component={Profile} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
