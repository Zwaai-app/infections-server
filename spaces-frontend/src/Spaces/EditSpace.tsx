import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../rootReducer'
import { useHistory } from 'react-router-dom'
import { t } from '../i18n'
import { Form, Button, Segment } from 'semantic-ui-react'
import { Space } from './spacesSlice'
import { eqNumber } from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import * as moment from 'moment'

export const EditSpace = (props: Props) => {
    const history = useHistory()

    const requestedId = props.match.params.id
    const list = useSelector((state: RootState) => state.spaces.list)
    const filtered = list.filter(val => val.id === requestedId)
    if (filtered.length !== 1) {
        history.push('/spaces')
        return <div></div>
    }
    return <EditSpaceBang space={filtered[0]} />
}

interface Props {
    match: {
        params: {
            id: string
        }
    }
}

const EditSpaceBang = ({ space }: { space: Space }) => {
    const history = useHistory()

    const [name, setName] = useState(space.name)
    const [desc, setDesc] = useState(space.description)
    const [autoCheckout, setAutocheckout] = useState(space.autoCheckout)

    return <div id='EditSpace'>
        <h1>{t('editSpace.header', 'Ruimte bewerken')}</h1>
        <Form>
            <Form.Input
                label={t('editSpace.nameLabel', 'Naam')}
                value={name}
                onChange={(_, { value }) => setName(value)}
            />
            <Form.Input
                label={t('editSpace.description', 'Omschrijving')}
                value={desc}
                onChange={(_, { value }) => setDesc(value)} />
            <Form.Field>
                <label>{t('EditSpace.autoCheckoutLabel', 'Automatisch uitchecken na:')}</label>
                <Form.Group >
                    {[30, 60, 2 * 60, 4 * 60, 8 * 60].map(minutes =>
                    <Form.Radio
                        <AutoCheckoutButton name='autoCheckout' minutes={minutes} value={autoCheckout} setValue={setAutocheckout} />)}
                        name='autoCheckout'
                        label={t('editSpace.disableAutocheckout', 'uitschakelen')}
                        checked={O.isNone(autoCheckout)}
                        onClick={() => setAutocheckout(O.none)}
                    />
                </Form.Group>
            </Form.Field>
            <Form.Field>
                <Segment basic secondary>{tAutoCheckoutExplanation}</Segment>
            </Form.Field>
            <Form.Field>
                <Button primary floated='right' disabled>{t('editSpace.saveButton', 'Opslaan')}</Button>
                <Button secondary floated='right'
                    onClick={() => history.push('/spaces')}
                >{t('editSpace.cancelButton', 'Annuleren')}</Button>
            </Form.Field>
        </Form>
    </div>
}

    return <Form.Radio
const AutoCheckoutButton = ({ name, minutes, value, setValue }: AutoCheckoutButtonProps) => {
        name={name}
        label={moment.duration(minutes, 'minutes').humanize()}
        checked={O.elem(eqNumber)(minutes * 60, value)}
        onClick={() => setValue(O.some(minutes * 60))}
    />
}

interface AutoCheckoutButtonProps {
    name: string
    minutes: number
    value: O.Option<number>
    setValue: (newValue: O.Option<number>) => void
}

const tAutoCheckoutExplanation
    = t(
        'editSpace.autoCheckoutExplanation',
        'Als een bezoeker vergeet uit te checken, wordt deze persoon na deze periode automatisch uitgecheckt. Kies de waarde die bij de ruimte past. Kies liever iets te lang dan iets te kort. Het wordt afgeraden om "uitschakelen" te kiezen, maar in speciale omstandigheden kan dit nodig zijn.')
