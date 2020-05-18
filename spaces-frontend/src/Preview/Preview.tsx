import React, { useEffect, useState } from 'react'
import * as O from 'fp-ts/lib/Option'
import * as R from 'fp-ts/lib/Record'
import { useSelector } from 'react-redux'
import { RootState } from '../rootReducer'
import { Space } from '../Spaces/spacesSlice'
import { pipe } from 'fp-ts/lib/pipeable'
import { useHistory } from 'react-router-dom'
import { t } from '../i18n'
import './Preview.css'
import QRCode from 'qrcode'
import { curry } from 'rambda'
import { logError } from '../utils'
import logo from '../Home/logo.png'
import { Icon, Button } from 'semantic-ui-react'

export const Preview = (props: Props) => {
    const spaces = useSelector((state: RootState) => state.spaces.spaces)

    return <div id='spacePreview'>
        <Button id='printButton'
            onClick={() => { window.print() }}
        >{t('preview.print', 'Afdrukken')}</Button>
        {pipe(
            O.fromNullable(props.match.params.id),
            O.chain(id => R.lookup(id, spaces)),
            O.fold(SpaceNotFound, ShowPreview))}
    </div>
}

interface Props { match: { params: { id: string } } }

const SpaceNotFound = () => {
    const history = useHistory()

    useEffect(() => {
        history.push('/spaces')
    })

    return <p>{t('previewSpace.notFound', 'De ruimte is niet gevonden.')}</p>
}

const ShowPreview = (space: Space) => {
    const [qrData, setQrData] = useState('')
    const profile = useSelector((state: RootState) => state.profile.data)!

    useEffect(() => {
        async function generateTheCode() {
            return QRCode.toDataURL('https://zwaai.app/checkin')
        }

        document.body.classList.add('preview')

        generateTheCode()
            .then(curry(setQrData))
            .catch(logError('Failed to generate QR code'))
    }, [setQrData])

    return <>
        <img id='logo'
            src={profile.logo}
            alt={t('showPreview.logoAlt', `${profile.organizationName} logo`)} />
        <img
            id='qr'
            src={qrData}
            alt={t('showPreview.qrCodeAlt', 'QR code voor deze ruimte')} />
        <div>
            <h1>{space.name}</h1>
            <p className='description'>{space.description}</p>
        </div>
        <div className='bottom'>
            <div className='contact'>{t('preview.contactText',
                'Bij vragen of problemen, neem contact op met:')}
                <span className='phone'>
                    <Icon name='phone' size='small' />{profile.phone}</span></div>
            <div className='zwaai'>
                <img src={logo} alt='Zwaai' />
                {/* <div className='url'><span className='proto'>https://</span>Zwaai.app</div> */}
            </div>
        </div>
    </>
}
