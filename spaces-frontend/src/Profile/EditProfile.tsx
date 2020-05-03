import React, { useState, useEffect } from 'react'
import { Form, Button, Image, Message } from 'semantic-ui-react'
import { t } from '../i18n'
import { useSelector } from 'react-redux'
import { RootState } from '../rootReducer'
import { maxLogoSizeKB, validLogo } from './profileValidation'
import * as E from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'

export const EditProfile = () => {
    const profileData = useSelector((state: RootState) => state.profile.data)

    const [orgName, setOrgName] = useState(profileData?.organizationName || '')
    const [orgUrl, setOrgUrl] = useState(profileData?.organizationUrl || '')
    const [phone, setPhone] = useState(profileData?.phone || '')
    const [logoFile, setLogoFile] = useState(null as File | null)
    const [logoData, setLogoData] = useState('')
    const logoDataValid = logoData ? validLogo(logoData) : E.right('')

    useEffect(() => {
        if (logoFile) {
            readImageData(logoFile, buf => {
                if (buf) {
                    setLogoData(`data:${logoFile.type};base64,` + window.btoa(buf))
                }
            })
        }
    })

    return <div id='EditProfile'>
        <h1>{t('editProfile.header', 'Profiel bewerken')}</h1>
        <Form error={E.isLeft(logoDataValid)}>
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
                label={t('editProfile.logoLabel', 'Logo (max {{maxSize}})', new Map([['maxSize', `${maxLogoSizeKB}KB`]]))}
                type='file'
                accept="image/*"
                onChange={e => { setLogoFile(e.target.files?.item(0) || null) }} />
            {(logoData && !E.isLeft(logoDataValid)) &&
                <Form.Field>
                    <label>{t('editProfile.logoPreviewLabel', 'Voorvertoning')}</label>
                    <Image bordered style={{ padding: '1em' }} src={logoData} />
                </Form.Field>
            }
            <Message error
                list={flow(
                    (e: E.Either<string, string>) => E.swap(e),
                    E.map((s: string) => [s]),
                    E.getOrElse(() => [] as string[])
                )(logoDataValid)}
            />
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
