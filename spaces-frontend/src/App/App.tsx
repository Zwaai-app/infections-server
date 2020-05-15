import React, { useEffect } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom'
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
import { AddSpace } from '../Spaces/AddSpace'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../rootReducer'
import { elem } from 'fp-ts/lib/Array'
import { eqString } from 'fp-ts/lib/Eq'
import { loadProfile } from '../Profile/profileSlice'
import { CheckProfile } from '../Profile/CheckProfile'

function App() {
  moment.locale(window.navigator.language)
  moment.duration().locale(window.navigator.language)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadProfile())
  })

  return (
    <div className="App">
      <Container>
        <Router>
          <ScrollToTop />
          <Topbar />
          <AppRoutes />
        </Router>
      </Container>
    </div>
  )
}

const unauthenticatedPaths = ['/', '/register', '/login']

export const AppRoutes = () => {
  const user = useSelector((state: RootState) => state.user)
  const history = useHistory()

  useEffect(() => {
    if ((!user.email || user.email.length === 0 || user.status !== 'loggedIn')
      && !elem(eqString)(history.location.pathname, unauthenticatedPaths)
    ) {
      history.push('/login')
    }
  })

  return <>
    {history.location.pathname !== '/profile' && <CheckProfile />}
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path='/login' component={Login} />
      <Route path="/register" component={Register} />
      <Route path='/profile' component={Profile} />
      <Route path='/spaces/add' component={AddSpace} />
      <Route path='/spaces/edit/:id' component={EditSpace} />
      <Route path='/spaces' component={SpacesList} />
    </Switch>
  </>
}

export default App
