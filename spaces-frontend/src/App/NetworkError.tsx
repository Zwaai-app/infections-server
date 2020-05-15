import React from 'react'
import { t } from '../i18n'
import logo from '../Home/logo.png'
import { Image, Container } from 'semantic-ui-react'

export const NetworkError = () => <>
    <Container textAlign='center'>
        <h1>{tNetworkErrorHeader}</h1>
        <p>{tNetworkErrorText}</p>
        <p>
            <Image inline src={logo} className="Home-logo" alt="logo" />
        </p>
    </Container>
</>

const tNetworkErrorHeader = t('networkError.header', 'Netwerkfout')
const tNetworkErrorText = t(
    'networkError.text',
    'Het lukt niet om de server te bereiken. Probeer het later nog eens alstublieft. Als het probleem aanhoudt, neem dan contact met ons op.')
