import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../rootReducer'
import { Message, Segment } from 'semantic-ui-react'
import { t } from '../i18n'
import { Link } from 'react-router-dom'
import { isCompleteProfile } from './profileSlice'

const tCompleteProfile = t('profile.completeWarning', 'Uw gebruikersprofiel is niet volledig ingevuld. Vul alstublieft eerst uw profiel volledig in op uw ')
const tProfilePage = t('profile.profilePage', 'profielpagina')

export const CheckProfile = () => {
    const { profileData, userLoggedIn } = useSelector((state: RootState) => ({
        profileData: state.profile.data,
        userLoggedIn: state.user.status === 'loggedIn'
    }))

    return <Segment basic width={16} id='CheckProfile'>
        {isCompleteProfile(profileData) || !userLoggedIn
            ? <></>
            : <Message warning>{tCompleteProfile}
                <Link to='/profile'>{tProfilePage}</Link>.
            </Message>
        }
    </Segment >
}
