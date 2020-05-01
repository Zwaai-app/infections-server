import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../rootReducer'
import { Message } from 'semantic-ui-react'
import { t } from '../i18n'
import { Link } from 'react-router-dom'

const tCompleteProfile = t('profile.completeWarning', 'Uw gebruikersprofiel is niet volledig ingevuld. Vul alstublieft eerst uw profiel volledig in op uw ')
const tProfilePage = t('profile.profilePage', 'profielpagina')

export const CheckProfile = () => {
    const profileData = useSelector((state: RootState) => state.profile.data)

    return <div id='CheckProfile'>
        {profileData
            ? <></>
            : <Message warning>{tCompleteProfile}
                <Link to='/profile'>{tProfilePage}</Link>.
            </Message>
        }
    </div >
}
