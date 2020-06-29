import React, { useEffect } from 'react'
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
import logo from '../Home/logo.png'
import { Icon, Button } from 'semantic-ui-react'
import { logError } from '../utils'
import { bytesToHex, createRandom } from './Random'
import { autoCheckoutToNumber } from '../Spaces/conversions'

export const Preview = (props: Props) => {
  const spaces = useSelector((state: RootState) => state.spaces.spaces)

  return (
    <div id='spacePreview'>
      <Button
        id='printButton'
        onClick={() => {
          window.print()
        }}
      >
        {t('preview.print', 'Afdrukken')}
      </Button>
      {pipe(
        O.fromNullable(props.match.params.id),
        O.chain(id => R.lookup(id, spaces)),
        O.fold(SpaceNotFound, ShowPreview)
      )}
    </div>
  )
}

interface Props {
  match: { params: { id: string } }
}

const SpaceNotFound = () => {
  const history = useHistory()

  useEffect(() => {
    history.push('/spaces')
  })

  return <p>{t('previewSpace.notFound', 'De ruimte is niet gevonden.')}</p>
}

const ShowPreview = (space: Space) => {
  const profile = useSelector((state: RootState) => state.profile.data)!

  useEffect(() => {
    async function generateTheCode () {
      const randomString = bytesToHex(createRandom())
      const autoCheckout = autoCheckoutToNumber(space.autoCheckout)
      const url = encodeURI(
        `zwaai-app://?random=${randomString}` +
          `&type=space` +
          `&name=${space.name}` +
          `&description=${space.description}` +
          `&autoCheckout=${autoCheckout}`
      )
      console.debug(url)
      return QRCode.toCanvas(document.getElementById('qr'), url, { scale: 10 })
    }

    document.body.classList.add('preview')

    generateTheCode().catch(logError('Failed to generate QR code'))
  }, [space])

  return (
    <>
      <img
        id='logo'
        src={profile.logo}
        alt={t('showPreview.logoAlt', `${profile.organizationName} logo`)}
      />
      <canvas id='qr' />
      <div>
        <h1>{space.name}</h1>
        <p className='description'>{space.description}</p>
      </div>
      <div className='bottom'>
        <div className='contact'>
          {t(
            'preview.contactText',
            'Bij vragen of problemen, neem contact op met:'
          )}
          <span className='phone'>
            <Icon name='phone' size='small' />
            {profile.phone}
          </span>
        </div>
        <div className='zwaai'>
          <img src={logo} alt='Zwaai' />
          <div className='url'>
            <span className='proto'>https://</span>Zwaai.app
          </div>
        </div>
      </div>
    </>
  )
}
