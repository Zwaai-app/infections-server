import React from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { t } from '../i18n'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../rootReducer'
import { logout } from '../User/userSlice'

export function Topbar() {
    const loggedIn = useSelector((state: RootState) => state.user.loggedIn)
    const dispatch = useDispatch()

    return (<Menu id='topbar' fixed='top' inverted>
        <Menu.Item>
            <Link to='/'>{t('topbar.home', 'Home')}</Link>
        </Menu.Item>
        <Menu.Menu position='right'>
            {loggedIn
                ? <Menu.Item><Link to="/" onClick={() => dispatch(logout())}>{t('topbar.logout', 'Uitloggen')}</Link></Menu.Item>
                : <>
                    <Menu.Item><Link to='/login'>{t('topbar.login', 'Inloggen')}</Link></Menu.Item>
                    <Menu.Item><Link to='/register'>{t('topbar.register', 'Registreren')}</Link></Menu.Item>
                </>
            }
        </Menu.Menu>
    </Menu>)
}
