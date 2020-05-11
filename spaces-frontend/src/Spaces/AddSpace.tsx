import React from 'react'
import { t } from '../i18n'
import { createSpace } from './spacesSlice'
import { SpaceForm } from './SpaceForm'
import { useDispatch } from 'react-redux'

export const AddSpace = () => {
    const dispatch = useDispatch()

    return <div id='AddSpace'>
        <h1>{t('AddSpace.header', 'Ruimte toevoegen')}</h1>
        <SpaceForm saveHandler={(name, description, autoCheckout) => {
            dispatch(createSpace({
                name, description, autoCheckout
            }))
        }} />
    </div>
}
