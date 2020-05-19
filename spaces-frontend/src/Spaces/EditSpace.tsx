import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../rootReducer'
import { useHistory } from 'react-router-dom'
import { t } from '../i18n'
import { Space, updateSpace, clearUpdateSpace } from './spacesSlice'
import { SpaceForm } from './SpaceForm'
import * as O from 'fp-ts/lib/Option'
import * as R from 'fp-ts/lib/Record'
import { pipe } from 'fp-ts/lib/pipeable'

export const EditSpace = (props: Props) => {
    const history = useHistory()

    const requestedId = props.match.params.id
    const spaces = useSelector((state: RootState) => state.spaces.spaces)
    return pipe(
        R.lookup(requestedId, spaces),
        O.fold(
            () => {
                history.push('/spaces')
                return <div></div>
            },
            space => <EditSpaceBang space={space} />
        )
    )
}

interface Props { match: { params: { id: string } } }

const EditSpaceBang = ({ space }: { space: Space }) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const spacesState = useSelector((state: RootState) => state.spaces)

    useEffect(() => {
        if (spacesState.updateStatus === 'success') {
            dispatch(clearUpdateSpace())
            history.push('/spaces')
        }
    })

    return <div id='EditSpace'>
        <h1>{t('editSpace.header', 'Ruimte bewerken')}</h1>
        <SpaceForm
            space={space}
            saveHandler={(name, description, autoCheckout) => {
                dispatch(updateSpace({ _id: space._id, name, description, autoCheckout }))
            }} />
    </div>
}
