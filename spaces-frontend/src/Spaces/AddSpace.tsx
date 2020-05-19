import React, { useEffect } from 'react'
import { t } from '../i18n'
import { createSpace, clearNewSpace } from './spacesSlice'
import { SpaceForm } from './SpaceForm'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../rootReducer'
import { useHistory } from 'react-router-dom'

export const AddSpace = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const spacesState = useSelector((state: RootState) => state.spaces)

    useEffect(() => {
        if
            (spacesState.newSpace && spacesState.newSpace.status === 'success') {
            dispatch(clearNewSpace())
            history.push('/spaces')
        }
    })

    return <div id='AddSpace'>
        <h1>{t('AddSpace.header', 'Ruimte toevoegen')}</h1>
        <SpaceForm saveHandler={(name, description, autoCheckout) => {
            dispatch(createSpace({
                name, description, autoCheckout
            }))
        }} />
    </div>
}
