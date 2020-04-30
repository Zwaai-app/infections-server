import React from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { t } from '../i18n'

export const Topbar = () => <Menu id='topbar' fixed='top' inverted>
    <Menu.Item>
        <Link to='/'>{t('topbar.home', 'Home')}</Link>
    </Menu.Item>
    <Menu.Menu position='right'>
        <Menu.Item>{t('topbar.login', 'Inloggen')}</Menu.Item>
        <Menu.Item>{t('topbar.register', 'Registreren')}</Menu.Item>
    </Menu.Menu>
</Menu>
