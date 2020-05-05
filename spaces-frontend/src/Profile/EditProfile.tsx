import React, { useState, useEffect } from 'react'
import { Form, Button, Image, Message, Input } from 'semantic-ui-react'
import { t } from '../i18n'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../rootReducer'
import { maxLogoSizeKB, validLogo, validateProfile } from './profileValidation'
import * as E from 'fp-ts/lib/Either'
import { flow, constant } from 'fp-ts/lib/function'
import { updateProfile, ProfileData } from './profileSlice'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import './EditProfile.css'

export const EditProfile = () => {
    const dispatch = useDispatch()

    const profileState = useSelector((state: RootState) => state.profile)
    const profileData = profileState.data

    const [orgName, setOrgName] = useState(profileData?.organizationName || '')
    const [orgUrl, setOrgUrl] = useState(profileData?.organizationUrl || '')
    const [phone, setPhone] = useState(profileData?.phone || '')
    const [logoFile, setLogoFile] = useState(null as File | null)
    const [logoData, setLogoData] = useState(profileData?.logo || '')
    const logoDataValid = logoData ? validLogo(logoData) : E.right('')
    const [wantsToSave, setWantsToSave] = useState(false)
    const profileDataValid = wantsToSave
        ? validateProfile(orgName, orgUrl, phone, logoData)
        : null
    const parsedPhoneNumber = parsePhoneNumberFromString(phone, 'NL')?.formatInternational()

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
        <Form error={E.isLeft(logoDataValid) || (!!profileDataValid && E.isLeft(profileDataValid))}>
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
            <Form.Field>
                <label>{t('editProfile.phoneLabel', 'Telefoonnummer voor ondersteuning')}</label>
                <Input
                    placeholder={t('editProfile.phonePlaceholder', '0123-456789')}
                    value={phone}
                    onChange={(_, { value }) => setPhone(value)} />
                {parsedPhoneNumber &&
                    <span className='additionalInfo'>
                        {t('editProfile.phoneIsSavedAs', 'Wordt opgeslagen als:')} {parsedPhoneNumber || ''}
                    </span>}
            </Form.Field>
            <Form.Input
                label={t('editProfile.logoLabel', 'Logo (max {{maxSize}})', new Map([['maxSize', `${maxLogoSizeKB}KB`]]))}
                type='file'
                accept="image/*"
                onChange={e => { setLogoFile(e.target.files?.item(0) || null) }} />
            {(logoData && !E.isLeft(logoDataValid)) &&
                <Form.Field className='logoPreview'>
                    <label>{t('editProfile.logoPreviewLabel', 'Voorvertoning')}</label>
                    <Image bordered src={logoData} />
                </Form.Field>
            }
            <Message error
                list={
                    wantsToSave && profileDataValid
                        ? E.getOrElse(constant([] as string[]))(E.swap(profileDataValid))
                        : flow(
                            (e: E.Either<string, string>) => E.swap(e),
                            E.map((s: string) => [s]),
                            E.getOrElse(() => [] as string[])
                        )(logoDataValid)}
            />
            <Form.Field>
                <Button floated='right' primary
                    loading={profileState.updateStatus === 'inProgress'}
                    onClick={() => {
                        setWantsToSave(true)
                        const v = validateProfile(orgName, orgUrl, phone, logoData)
                        E.map((profile: ProfileData) => dispatch(updateProfile(profile)))(v)
                    }}
                >{t('editProfile.saveButton', 'Opslaan')}</Button>
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
