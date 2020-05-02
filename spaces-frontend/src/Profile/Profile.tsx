import React, { useState } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { t } from '../i18n'
import { useSelector } from 'react-redux'
import { RootState } from '../rootReducer'

export const Profile = () => {
    const profileData = useSelector((state: RootState) => state.profile.data)

    const [orgName, setOrgName] = useState(profileData?.organizationName || '')
    const [orgUrl, setOrgUrl] = useState(profileData?.organizationUrl || '')
    const [phone, setPhone] = useState(profileData?.phone || '')

    return <div id='EditProfile'>
        <h1>{t('editProfile.header', 'Profiel bewerken')}</h1>
        <Form>
            <Form.Input
                label={t('editProfile.organizationNameLabel', 'Organisatienaam')}
                placeholder={t('editProfile.organizationNamePlaceholder', 'Naam van uw organisatie')}
                value={orgName}
                onChange={(_, { value }) => setOrgName(value)} />
            <Form.Input
                label={t('editProfile.organizationUrlLabel', 'Website van uw organisatie')}
                placeholder={t('editProfile.organizationUrlPlaceholder', 'https://www.example.com')}
                value={orgUrl}
                onChange={(_, { value }) => setOrgUrl(value)} />
            <Form.Input
                label={t('editProfile.phoneLabel', 'Telefoonnummer voor ondersteuning')}
                placeholder={t('editProfile.phonePlaceholder', '0123-456789')}
                value={phone}
                onChange={(_, { value }) => setPhone(value)} />
            <Form.Field>
                <Button floated='right' disabled primary>{t('editProfile.saveButton', 'Opslaan')}</Button>
            </Form.Field>
        </Form>
    </div>
}
