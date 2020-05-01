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
                : <>
                    <Menu.Item><Link to='/login'>{t('topbar.login', 'Inloggen')}</Link></Menu.Item>
                    <Menu.Item><Link to='/register'>{t('topbar.register', 'Registreren')}</Link></Menu.Item>
                </>
            }
        </Menu.Menu>
    </Menu>)
}
