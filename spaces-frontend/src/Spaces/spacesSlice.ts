import * as O from 'fp-ts/lib/Option'
import * as A from 'fp-ts/lib/Array'
import * as R from 'fp-ts/lib/Record'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getLastSemigroup } from 'fp-ts/lib/Semigroup'
import { flow, constant } from 'fp-ts/lib/function'

type Seconds = number

export interface ClientSideOnlySpace {
  name: string
  description: string
  autoCheckout: O.Option<Seconds>
}

type SpaceId = string
interface ThingWithId {
  id: SpaceId
}

export type Space = ThingWithId & ClientSideOnlySpace

export interface SpacesState {
  spaces: Record<SpaceId, Space>
}

export const listToRecord = (spaces: Space[]): Record<string, Space> =>
  R.fromFoldableMap(getLastSemigroup<Space>(), A.array)(spaces, s => [s.id, s])

const initialSpaces = [
  { id: '111', name: 'foo1', description: 'bar', autoCheckout: O.none },
  {
    id: '222',
    name: 'HTC33 Atelier 5',
    description: 'Rechts-achter groep Software Concepts',
    autoCheckout: O.some(60 * 60 * 8)
  },
  { id: '333', name: 'foo2', description: '', autoCheckout: O.none },
  { id: '444', name: 'foo3', description: 'bar', autoCheckout: O.none }
]

const initialState: SpacesState = {
  spaces: listToRecord(initialSpaces)
}

export const spacesSlice = createSlice({
  name: 'spaces',
  initialState,
  reducers: {
    createSpace (
      _state: SpacesState,
      _action: PayloadAction<ClientSideOnlySpace>
    ) {
      throw new Error('todo')
    },
    updateSpace (state: SpacesState, action: PayloadAction<Space>) {
      state.spaces = flow(
        R.updateAt(action.payload.id, action.payload),
        O.getOrElse(constant(state.spaces))
      )(state.spaces)
    },
    deleteSpace (state: SpacesState, action: PayloadAction<Space>) {
      state.spaces = R.deleteAt(action.payload.id)(state.spaces)
    }
  }
})

export const { createSpace, updateSpace, deleteSpace } = spacesSlice.actions

export default spacesSlice.reducer
