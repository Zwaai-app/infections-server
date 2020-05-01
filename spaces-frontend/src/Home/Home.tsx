
import React from 'react'
import logo from './logo.png'
import './Home.css'
import { Image } from 'semantic-ui-react'
import { CheckProfile } from '../Profile/CheckProfile'

export const Home = () => {
  return (
    <div className="Home">
      <CheckProfile />
      <header className="Home-header">
        <Image src={logo} className="Home-logo" alt="logo" />
      </header>
    </div>
  )
}
