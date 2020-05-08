import React, { useState } from 'react'
import { t } from '../i18n'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../rootReducer'
import { Table, Button, Confirm } from 'semantic-ui-react'
import { Space, deleteSpace } from './spacesSlice'
import * as O from 'fp-ts/lib/Option'
import { constant, flip } from 'fp-ts/lib/function'
import * as moment from 'moment'
import 'moment/locale/nl'
import * as R from 'rambda'
import { pipe } from 'rxjs'
import { eqString } from 'fp-ts/lib/Eq'

export const SpacesList = () => {
    const [selected, setSelected] = useState(O.none as O.Option<string>)
    let spaces = useSelector((state: RootState) => state.spaces.list)
    return <div id='SpacesList'>
        <h1>{t('spacesList.header', 'Ruimtebeheer')}</h1>
        <Table selectable celled unstackable compact size='small' color='orange'>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>{t('spacesTable.headerName', 'Ruimte')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('spacesTable.headerAutoCheckout', 'Auto checkout')}</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {spaces.map((s: Space) =>
                    <Table.Row
                        key={s.id}
                        active={O.elem(eqString)(s.id, selected)}
                        onClick={() => setSelected(O.some(s.id))} >
                        <Table.Cell>{s.name}<div>{s.description || '\u00a0'}</div></Table.Cell>
                        <Table.Cell>{pipe(
                            O.map(R.curry(flip(moment.duration))('seconds')),
                            O.map(d => d.locale('nl').humanize()),
                            O.getOrElse(constant('—'))
                        )(s.autoCheckout)}
                            {O.elem(eqString)(s.id, selected) &&
                                <ActionButtons space={s} />}
                        </Table.Cell>
                    </Table.Row>)}
            </Table.Body>
        </Table>
    </div >
}

const ActionButtons = ({ space }: { space: Space }) => {
    const dispatch = useDispatch()
    const [isDeleteConfShowing, setDeleteConfShowing] = useState(false)

    return <Button.Group floated='right' size='small'>
        <Button icon='edit' positive />
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
