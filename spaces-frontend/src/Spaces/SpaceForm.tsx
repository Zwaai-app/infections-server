import React, { useState, useEffect } from 'react'
import { Space } from './spacesSlice'
import { Form, Segment, Button, Message } from 'semantic-ui-react'
import { t } from '../i18n'
import { useHistory } from 'react-router-dom'
import * as O from 'fp-ts/lib/Option'
import { eqNumber } from 'fp-ts/lib/Eq'
import * as moment from 'moment'
import { useSelector } from 'react-redux'
import { RootState } from '../rootReducer'
import { isError, Failed } from '../utils/syncStatus'

export const SpaceForm = ({ space, saveHandler }: SpaceFormProps) => {
    const history = useHistory()
    const spacesState = useSelector((state: RootState) => state.spaces)
    const newSpace = spacesState.newSpace

    const [name, setName] = useState(space?.name || newSpace?.name || '')
    const [desc, setDesc] = useState(space?.description || newSpace?.description || '')
    const [autoCheckout, setAutocheckout] = useState(space?.autoCheckout || newSpace?.autoCheckout || null)
    const [wantsToSave, setWantsToSave] = useState(false)

    const invalid = name === '' || !autoCheckout

    useEffect(() => {
        if (spacesState.newSpace && spacesState.newSpace.status === 'success') {
            history.push('/spaces')
        }
    })

    return <div id='SpaceForm'>
        <Message error hidden={!spacesState.newSpace || !isError(spacesState.newSpace.status)}>
            <Message.Header>{t('spaceform.storeNewSpaceErrorHeader', 'Serverprobleem')}</Message.Header>
            <p>{t('spaceForm.storeNewSpaceErrorMessage', 'Er ging iets mis bij het opslaan van uw ruimte; probeer het later nog eens aub.')}</p>
            <p>{t('spaceForm.errorMessage', 'Foutmelding')}: {(spacesState.newSpace?.status as Failed | null)?.error}</p>
        </Message>
        <Form error={wantsToSave && invalid}>
            <Form.Input
                label={t('editSpace.nameLabel', 'Naam')}
                value={name}
                onChange={(_, { value }) => setName(value)}
            />
            <Form.Input
                label={t('editSpace.description', 'Omschrijving (optioneel)')}
                value={desc}
                onChange={(_, { value }) => setDesc(value)} />
            <Form.Field>
                <label>{t('EditSpace.autoCheckoutLabel', 'Automatisch uitchecken na')}</label>
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
            <Message error
                list={[name === '' ? tNameIsRequired : undefined,
                autoCheckout === null ? tAutoCheckoutIsRequired : undefined]}
            />
            <Form.Field>
                <Button primary floated='right'
                    loading={spacesState.newSpace?.status === 'inProgress'}
                    onClick={() => {
                        setWantsToSave(true)
                        !invalid && saveHandler(name, desc, autoCheckout!)
                    }}>{t('editSpace.saveButton', 'Opslaan')}</Button>
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

const tNameIsRequired
    = t('editSpace.nameIsRequired', 'Naam moet verplicht ingevuld worden')
const tAutoCheckoutIsRequired
    = t('editSpace.autoCheckoutIsRequired', 'Automatisch uitchecken moet verplicht ingevuld worden')
const tAutoCheckoutExplanation
    = t(
        'editSpace.autoCheckoutExplanation',
        'Als een bezoeker vergeet uit te checken, wordt deze persoon na deze periode automatisch uitgecheckt. Kies de waarde die bij de ruimte past. Kies liever iets te lang dan iets te kort. Het wordt afgeraden om "uitschakelen" te kiezen, maar in speciale omstandigheden kan dit nodig zijn.')
