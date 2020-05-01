import React from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { t } from '../i18n'
import { useSelector } from 'react-redux'
import { RootState } from '../rootReducer'

export function Topbar() {
    const token = useSelector((state: RootState) => state.user.token)

    return (<Menu id='topbar' fixed='top' inverted>
        <Menu.Item>
            <Link to='/'>{t('topbar.home', 'Home')}</Link>
        </Menu.Item>
        <Menu.Menu position='right'>
            {token
                ? <Menu.Item>{token}</Menu.Item>
                : <Menu.Item>{t('topbar.login', 'Inloggen')}</Menu.Item>
            }
            <Menu.Item>{t('topbar.register', 'Registreren')}</Menu.Item>
        </Menu.Menu>
    </Menu>)
}
