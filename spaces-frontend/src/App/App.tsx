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
import { SpacesList } from '../Spaces/SpacesList'
import moment from 'moment'
import { Container } from 'semantic-ui-react'
import { EditSpace } from '../Spaces/EditSpace'

function App() {
  moment.locale(window.navigator.language)
  moment.duration().locale(window.navigator.language)

  return (
    <div className="App">
      <Container>
        <Router>
          <ScrollToTop />
          <Topbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path='/login' component={Login} />
            <Route path="/register" component={Register} />
            <Route path='/profile' component={Profile} />
            <Route path='/spaces/edit/:id' component={EditSpace} />
            <Route path='/spaces' component={SpacesList} />
          </Switch>
        </Router>
      </Container>
    </div>
  )
}

export default App
