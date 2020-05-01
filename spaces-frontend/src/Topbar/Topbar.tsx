import React from 'react'
import { Menu, Icon, Dropdown } from 'semantic-ui-react'
import { Link, useHistory } from 'react-router-dom'
import { t } from '../i18n'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../rootReducer'
import { logout } from '../User/userSlice'

export function Topbar() {
    const history = useHistory()
    const loggedIn = useSelector((state: RootState) => state.user.status === 'loggedIn')
    const dispatch = useDispatch()
    const profileData = useSelector((state: RootState) => state.profile.data)
    const organizationName = profileData?.organizationName || ''

    return (<Menu id='topbar' fixed='top' inverted>
        <Menu.Item>
            <Link to='/'><Icon name='home' aria-label={t('topbar.home', 'Home')} /></Link>
        </Menu.Item>
        <Menu.Menu position='right'>
            {loggedIn
                ? <>
                    <Dropdown item text={organizationName} loading={!profileData}>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => {
                                history.push('/profile')
                            }}>{t('topbar.profile', 'Profiel')}</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => {
                                dispatch(logout())
                                history.replace('/')
                            }}>{t('topbar.logout', 'Uitloggen')}</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </>
                : <>
                    <Menu.Item><Link to='/login'>{t('topbar.login', 'Inloggen')}</Link></Menu.Item>
                    <Menu.Item><Link to='/register'>{t('topbar.register', 'Registreren')}</Link></Menu.Item>
                </>
            }
        </Menu.Menu>
    </Menu>)
}
