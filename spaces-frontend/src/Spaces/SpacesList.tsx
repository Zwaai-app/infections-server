import React, { useState } from 'react'
import { t } from '../i18n'
import { useSelector } from 'react-redux'
import { RootState } from '../rootReducer'
import { Table, Button } from 'semantic-ui-react'
import { Space } from './spacesSlice'
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
    spaces = [
        { id: '111', name: 'foo1', description: 'bar', autoCheckout: O.none },
        { id: '222', name: 'HTC33 Atelier 5', description: 'Rechts-achter groep Software Concepts', autoCheckout: O.some(60 * 60 * 8) },
        { id: '333', name: 'foo2', description: '', autoCheckout: O.none },
        { id: '444', name: 'foo3', description: 'bar', autoCheckout: O.none }]
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
                                <Button.Group floated='right' size='small'>
                                    <Button icon='edit' positive />
                                    <Button icon='trash' negative />
                                </Button.Group>}
                        </Table.Cell>
                    </Table.Row>)}
            </Table.Body>
        </Table>
    </div >
}
