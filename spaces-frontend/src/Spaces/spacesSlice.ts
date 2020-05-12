import * as O from 'fp-ts/lib/Option'
import * as A from 'fp-ts/lib/Array'
import * as R from 'fp-ts/lib/Record'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getLastSemigroup } from 'fp-ts/lib/Semigroup'
import { flow, constant } from 'fp-ts/lib/function'
import { SyncStatus } from '../utils/syncStatus'

type Seconds = number

export interface SpaceFields {
  name: string
  description: string
  autoCheckout: O.Option<Seconds>
}

type SpaceId = string
export interface Space extends SpaceFields {
  id: SpaceId
}

type SpaceList = Record<SpaceId, Space>
export type NewSpace = SpaceFields & { status: SyncStatus }
export interface SpacesState {
  spaces: SpaceList
  newSpace?: NewSpace
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

function existingName (spaces: SpaceList, name: string): boolean {
  return R.some((space: Space) => space.name === name)(spaces)
}

export const spacesSlice = createSlice({
  name: 'spaces',
  initialState,
  reducers: {
    clearNewSpace (state: SpacesState, _action: PayloadAction<void>) {
      state.newSpace = undefined
    },
    createSpace (state: SpacesState, action: PayloadAction<SpaceFields>) {
      if (!state.newSpace && !existingName(state.spaces, action.payload.name)) {
        const newSpace: NewSpace = { ...action.payload, status: 'idle' }
        state.newSpace = newSpace
      }
    },
    updateSpace (state: SpacesState, action: PayloadAction<Space>) {
      state.spaces = flow(
        R.updateAt(action.payload.id, action.payload),
        O.getOrElse(constant(state.spaces))
      )(state.spaces)
    },
    deleteSpace (state: SpacesState, action: PayloadAction<Space>) {
      state.spaces = R.deleteAt(action.payload.id)(state.spaces)
    },
    storeNewSpaceStarted (state: SpacesState, _action: PayloadAction<void>) {
      if (state.newSpace) {
        state.newSpace.status = 'inProgress'
      }
    },
    storeNewSpaceSucceeded (state: SpacesState, _action: PayloadAction<void>) {
      if (state.newSpace) {
        state.newSpace.status = 'success'
      }
    },
    storeNewSpaceFailed (state: SpacesState, action: PayloadAction<string>) {
      if (state.newSpace) {
        state.newSpace.status = { error: action.payload }
      }
    }
  }
})

export type CreateSpaceAction = ReturnType<typeof createSpace>

export const {
  clearNewSpace,
  createSpace,
  updateSpace,
  deleteSpace,
  storeNewSpaceStarted,
  storeNewSpaceSucceeded,
  storeNewSpaceFailed
} = spacesSlice.actions

export default spacesSlice.reducer
