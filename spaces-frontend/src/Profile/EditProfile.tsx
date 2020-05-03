import React, { useState, useEffect } from 'react'
import { Form, Button, Image } from 'semantic-ui-react'
import { t } from '../i18n'
import { useSelector } from 'react-redux'
import { RootState } from '../rootReducer'

export const EditProfile = () => {
    const profileData = useSelector((state: RootState) => state.profile.data)

    const [orgName, setOrgName] = useState(profileData?.organizationName || '')
    const [orgUrl, setOrgUrl] = useState(profileData?.organizationUrl || '')
    const [phone, setPhone] = useState(profileData?.phone || '')
    const [iconFile, setIconFile] = useState(null as File | null)
    const [iconData, setIconData] = useState('')

    useEffect(() => {
        if (iconFile) {
            readImageData(iconFile, buf => {
                if (buf) {
                    setIconData(`data:${iconFile.type};base64,` + window.btoa(buf))
                }
            })
        }
    })
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
                type='url'
                value={orgUrl}
                onChange={(_, { value }) => setOrgUrl(value)} />
            <Form.Input
                label={t('editProfile.phoneLabel', 'Telefoonnummer voor ondersteuning')}
                placeholder={t('editProfile.phonePlaceholder', '0123-456789')}
                value={phone}
                onChange={(_, { value }) => setPhone(value)} />
            <Form.Input
                label={t('editProfile.logoLabel', 'Logo')}
                type='file'
                accept="image/*"
                onChange={e => { setIconFile(e.target.files?.item(0) || null) }} />
            {iconData &&
                <Form.Field>
                    <label>{t('editProfile.logoPreviewLabel', 'Voorvertoning')}</label>
                    <Image bordered style={{ padding: '1em' }} src={iconData} />
                </Form.Field>
            }
            <Form.Field>
                <Button floated='right' disabled primary>{t('editProfile.saveButton', 'Opslaan')}</Button>
            </Form.Field>
        </Form>
    </div>
}

function readImageData(file: File, onLoad: (buf: string | null) => void) {
    const reader = new FileReader()
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => { onLoad(reader.result as string | null) }
    reader.readAsBinaryString(file)
}
