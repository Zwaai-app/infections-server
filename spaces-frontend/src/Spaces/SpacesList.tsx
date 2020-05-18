import React, { useState } from 'react'
import { t } from '../i18n'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../rootReducer'
import { Table, Button, Confirm, Message } from 'semantic-ui-react'
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
import { isError, Failed } from '../utils/syncStatus'

export const SpacesList = () => {
    const [selected, setSelected] = useState(O.none as O.Option<string>)
    let spaces = useSelector((state: RootState) => state.spaces.spaces)
    return <div id='SpacesList'>
        <h1>{t('spacesList.header', 'Ruimtebeheer')}
            <NewSpaceButton />
            <ReloadButton />
        </h1>
        <LoadSpacesErrors />
        <Table selectable celled unstackable compact size='small' color='orange'>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>{t('spacesTable.headerName', 'Ruimte')}</Table.HeaderCell>
                    <Table.HeaderCell width={5}>{t('spacesTable.headerAutoCheckout', 'Auto checkout')}</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {R.collect((_, s: Space) =>
                    <Table.Row
                        key={s._id}
                        active={O.elem(eqString)(s._id, selected)}
                        onClick={() => setSelected(O.some(s._id))} >
                        <Table.Cell>{O.elem(eqString)(s._id, selected) &&
                            <ActionButtons space={s} />}{s.name}<div>{s.description || '\u00a0'}</div>

                        </Table.Cell>
                        <Table.Cell>{pipe(
                            O.map(curry(flip(moment.duration))('seconds')),
                            O.map(d => d.humanize()),
                            O.getOrElse(constant('—'))
                        )(s.autoCheckout)}
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

const LoadSpacesErrors = () => {
    const loadingState = useSelector((state: RootState) => state.spaces.loadingStatus)
    if (isError(loadingState)) {
        return <Message error>
            <Message.Header>{t('loadSpaces.errorsHeader', 'Er ging iets mis')}</Message.Header>
            <Message.Content>
                <p>{tErrorMessageContent1}</p>
                <p>{tErrorMessageContent2((loadingState as Failed).error)}</p></Message.Content>
        </Message>
    } else {
        return <></>
    }
}
const ActionButtons = ({ space }: { space: Space }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [isDeleteConfShowing, setDeleteConfShowing] = useState(false)

    return <Button.Group floated='right' size='small'>
        <Button icon='print'
            color='blue'
            title={t('spacesList.printButtonLabel', 'Afdrukken')}
            aria-label={t('spacesList.printButtonLabel', 'Afdrukken')}
            onClick={() => { showPreview(space) }} />
        <Button icon='edit' positive
            title={t('spacesList.editButtonLabel', 'Bewerken')}
            aria-label={t('spacesList.editButtonLabel', 'Bewerken')}
            onClick={() => history.push(`/spaces/edit/${space._id}`)} />
        <Button icon='trash' negative
            title={t('spacesList.deleteButtonLabel', 'Verwijderen')}
            aria-label={t('spacesList.deleteButtonLabel', 'Verwijderen')}
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

function showPreview(space: Space) {
    window.open(`/preview/${space._id}`, 'preview')
}

const tErrorMessageContent1 = t(
    'loadSpaces.errorsContent1',
    'De server gaf een foutmelding bij het laden van de ruimtes. Probeer het later nog eens.')
const tErrorMessageContent2 = (error: string) => t(
    'loadSpaces.errorsContent',
    'Foutmelding: {{error}}', new Map([['error', error]]))
