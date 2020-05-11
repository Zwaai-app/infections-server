import React, { useState } from 'react'
import { Space } from './spacesSlice'
import { Form, Segment, Button } from 'semantic-ui-react'
import { t } from '../i18n'
import { useHistory } from 'react-router-dom'
import * as O from 'fp-ts/lib/Option'
import { eqNumber } from 'fp-ts/lib/Eq'
import * as moment from 'moment'

export const SpaceForm = ({ space, saveHandler }: SpaceFormProps) => {
    const history = useHistory()

    const [name, setName] = useState(space?.name || '')
    const [desc, setDesc] = useState(space?.description || '')
    const [autoCheckout, setAutocheckout] = useState(space?.autoCheckout || null)

    return <div id='SpaceForm'>
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
                <Form.Group>
                    {[30, 60, 2 * 60, 4 * 60, 8 * 60].map(minutes =>
                        <AutoCheckoutButton
                            name='autoCheckout'
                            key={minutes}
                            minutes={minutes}
                            value={autoCheckout}
                            setValue={setAutocheckout} />)}
                    <Form.Radio width='16'
                        name='autoCheckout'
                        label={t('editSpace.disableAutocheckout', 'uitschakelen')}
                        checked={!!autoCheckout && O.isNone(autoCheckout)}
                        onClick={() => setAutocheckout(O.none)}
                    />
                </Form.Group>
            </Form.Field>
            <Form.Field>
                <Segment basic secondary>{tAutoCheckoutExplanation}</Segment>
            </Form.Field>
            <Form.Field>
                <Button primary floated='right' disabled
                    onClick={() => saveHandler(name, desc, autoCheckout!)}>{t('editSpace.saveButton', 'Opslaan')}</Button>
                <Button secondary floated='right'
                    onClick={() => history.push('/spaces')}
                >{t('editSpace.cancelButton', 'Annuleren')}</Button>
            </Form.Field>
        </Form>

    </div>
}

export type SaveHandler = (name: string, description: string, autoCheckout: O.Option<number>) => void

interface SpaceFormProps {
    space?: Space
    saveHandler: SaveHandler
}

const AutoCheckoutButton = ({ name, minutes, value, setValue }: AutoCheckoutButtonProps) => {
    return <Form.Radio width='16'
        name={name}
        label={moment.duration(minutes, 'minutes').humanize()}
        checked={!!value && O.elem(eqNumber)(minutes * 60, value)}
        onClick={() => setValue(O.some(minutes * 60))}
    />
}

interface AutoCheckoutButtonProps {
    name: string
    minutes: number
    value: O.Option<number> | null
    setValue: (newValue: O.Option<number>) => void
}

const tAutoCheckoutExplanation
    = t(
        'editSpace.autoCheckoutExplanation',
        'Als een bezoeker vergeet uit te checken, wordt deze persoon na deze periode automatisch uitgecheckt. Kies de waarde die bij de ruimte past. Kies liever iets te lang dan iets te kort. Het wordt afgeraden om "uitschakelen" te kiezen, maar in speciale omstandigheden kan dit nodig zijn.')
