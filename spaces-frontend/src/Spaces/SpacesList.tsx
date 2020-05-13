import React, { useState } from 'react'
import { t } from '../i18n'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../rootReducer'
import { Table, Button, Confirm } from 'semantic-ui-react'
import { Space, deleteSpace, clearNewSpace, loadSpaces } from './spacesSlice'
import * as O from 'fp-ts/lib/Option'
import * as R from 'fp-ts/lib/Record'
import { constant, flip } from 'fp-ts/lib/function'
import * as moment from 'moment'
import 'moment/locale/nl'
import { curry } from 'rambda'
import { pipe } from 'rxjs'
import { eqString } from 'fp-ts/lib/Eq'
import { useHistory } from 'react-router-dom'

export const SpacesList = () => {
    const [selected, setSelected] = useState(O.none as O.Option<string>)
    let spaces = useSelector((state: RootState) => state.spaces.spaces)
    return <div id='SpacesList'>
        <h1>{t('spacesList.header', 'Ruimtebeheer')}
            <NewSpaceButton />
            <ReloadButton />
        </h1>
        <Table selectable celled unstackable compact size='small' color='orange'>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>{t('spacesTable.headerName', 'Ruimte')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('spacesTable.headerAutoCheckout', 'Auto checkout')}</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {R.collect((_, s: Space) =>
                    <Table.Row
                        key={s._id}
                        active={O.elem(eqString)(s._id, selected)}
                        onClick={() => setSelected(O.some(s._id))} >
                        <Table.Cell>{s.name}<div>{s.description || '\u00a0'}</div></Table.Cell>
                        <Table.Cell>{pipe(
                            O.map(curry(flip(moment.duration))('seconds')),
                            O.map(d => d.humanize()),
                            O.getOrElse(constant('—'))
                        )(s.autoCheckout)}
                            {O.elem(eqString)(s._id, selected) &&
                                <ActionButtons space={s} />}
                        </Table.Cell>
                    </Table.Row>)(spaces)}
            </Table.Body>
        </Table>
        <NewSpaceButton />
    </div >
}

const NewSpaceButton = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    return <Button
        floated='right'
        icon='add'
        alt={t('spacesList.createNewButton', 'Ruimte toevoegen')}
        onClick={() => {
            dispatch(clearNewSpace())
            history.push('/spaces/add')
        }} />
}

const ReloadButton = () => {
    const dispatch = useDispatch()
    const loadingState = useSelector((state: RootState) => state.spaces.loadingStatus)
    const isLoading = loadingState === 'inProgress'
    const isSuccess = loadingState === 'success'

    return isSuccess
        ? <Button
            floated='right'
            icon='checkmark'
            basic={true} color='green' />
        : <Button
            floated='right'
            icon='refresh'
            basic={isLoading} loading={isLoading} disabled={isLoading}
            alt={t('spacesList.reloadButton', 'Ruimtes opnieuw laden van server')}
            onClick={() => { dispatch(loadSpaces()) }} />
}

const ActionButtons = ({ space }: { space: Space }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [isDeleteConfShowing, setDeleteConfShowing] = useState(false)

    return <Button.Group floated='right' size='small'>
        <Button icon='edit' positive
            onClick={() => history.push(`/spaces/edit/${space._id}`)} />
        <Button icon='trash' negative
            onClick={() => setDeleteConfShowing(true)} />
        <Confirm
            open={isDeleteConfShowing}
            content={t('editProfile.deleteConfirmation', 'Wilt u de ruimte {{name}} verwijderen?', new Map([['name', space.name]]))}
            onCancel={() => setDeleteConfShowing(false)}
            onConfirm={() => {
                setDeleteConfShowing(false)
                dispatch(deleteSpace(space))
            }}
            cancelButton={t('editProfile.cancelDelete', 'Annuleren')}
            confirmButton={t('editProfile.confirmDelete', 'Verwijder')}
        ></Confirm>
    </Button.Group>
}
