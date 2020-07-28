import * as O from 'fp-ts/lib/Option'
import * as A from 'fp-ts/lib/Array'
import * as R from 'fp-ts/lib/Record'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getLastSemigroup } from 'fp-ts/lib/Semigroup'
import { SyncStatus } from '../utils/syncStatus'
import { ErrorInfo } from '../utils/ajaxError'
import { autoCheckoutFromNumber, dateFromServer } from './conversions'

type Seconds = number

export interface NewSpaceFields {
  name: string
  description: string
  autoCheckout: O.Option<Seconds>
}

type SpaceId = string
interface ThingWithId {
  _id: SpaceId
}
export interface Space extends NewSpaceFields, ThingWithId {
  createdAt: number
  updatedAt: number
}

export interface SpaceFromServer {
  _id: SpaceId
  name: string
  description: string
  autoCheckout: number
  createdAt: string
  updatedAt: string
}

export type SpaceList = Record<SpaceId, Space>
export type NewSpace = NewSpaceFields & { status: SyncStatus }
export interface SpacesState {
  spaces: SpaceList
  newSpace?: NewSpace
  loadingStatus: SyncStatus
  updateStatus: SyncStatus
  deleteStatus: SyncStatus
}

export const listToRecord = (spaces: Space[]): Record<string, Space> =>
  R.fromFoldableMap(getLastSemigroup<Space>(), A.array)(spaces, s => [s._id, s])

const initialState: SpacesState = {
  spaces: listToRecord([]),
  loadingStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle'
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
    createSpace (state: SpacesState, action: PayloadAction<NewSpaceFields>) {
      if (!state.newSpace && !existingName(state.spaces, action.payload.name)) {
        const newSpace: NewSpace = { ...action.payload, status: 'idle' }
        state.newSpace = newSpace
      }
    },
    clearUpdateSpace (state: SpacesState, _action: PayloadAction<void>) {
      state.updateStatus = 'idle'
    },
    updateSpace (
      state: SpacesState,
      _action: PayloadAction<NewSpaceFields & ThingWithId>
    ) {
      state.updateStatus = 'inProgress'
    },
    updateSpaceSucceeded (state: SpacesState, _action: PayloadAction<void>) {
      state.updateStatus = 'success'
    },
    updateSpaceFailed (state: SpacesState, action: PayloadAction<ErrorInfo>) {
      state.updateStatus = { error: action.payload.message }
    },
    deleteSpace (state: SpacesState, _action: PayloadAction<Space>) {
      state.deleteStatus = 'inProgress'
    },
    deleteSucceeded (state: SpacesState, _action: PayloadAction<void>) {
      state.deleteStatus = 'success'
    },
    deleteFailed (state: SpacesState, action: PayloadAction<ErrorInfo>) {
      state.deleteStatus = { error: action.payload.message }
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
    storeNewSpaceFailed (state: SpacesState, action: PayloadAction<ErrorInfo>) {
      if (state.newSpace) {
        state.newSpace.status = { error: action.payload.message }
      }
    },
    loadSpaces (state: SpacesState, _action: PayloadAction<void>) {
      state.loadingStatus = 'inProgress'
    },
    loadSpacesSucceeded (
      state: SpacesState,
      action: PayloadAction<SpaceFromServer[]>
    ) {
      state.loadingStatus = 'success'
      const spaces = action.payload.map(serverRep => ({
        ...serverRep,
        autoCheckout: autoCheckoutFromNumber(serverRep.autoCheckout),
        createdAt: dateFromServer(serverRep.createdAt),
        updatedAt: dateFromServer(serverRep.updatedAt)
      }))
      state.spaces = listToRecord(spaces)
    },
    loadSpacesFailed (state: SpacesState, action: PayloadAction<ErrorInfo>) {
      state.loadingStatus = { error: action.payload.message }
    },
    loadSpacesReset (state: SpacesState, _action: PayloadAction<void>) {
      state.loadingStatus = 'idle'
    }
  }
})

export type CreateSpaceAction = ReturnType<typeof createSpace>
export type LoadSpacesAction = ReturnType<typeof loadSpaces>
export type LoadSpacesSucceededAction = ReturnType<typeof loadSpacesSucceeded>
export type DeleteSpaceAction = ReturnType<typeof deleteSpace>
export type UpdateSpaceAction = ReturnType<typeof updateSpace>

export const {
  clearNewSpace,
  createSpace,
  clearUpdateSpace,
  updateSpace,
  updateSpaceSucceeded,
  updateSpaceFailed,
  deleteSpace,
  deleteSucceeded,
  deleteFailed,
  storeNewSpaceStarted,
  storeNewSpaceSucceeded,
  storeNewSpaceFailed,
  loadSpaces,
  loadSpacesSucceeded,
  loadSpacesFailed,
  loadSpacesReset
} = spacesSlice.actions

export default spacesSlice.reducer
