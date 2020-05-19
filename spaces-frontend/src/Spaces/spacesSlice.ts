import * as O from 'fp-ts/lib/Option'
import * as A from 'fp-ts/lib/Array'
import * as R from 'fp-ts/lib/Record'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getLastSemigroup } from 'fp-ts/lib/Semigroup'
import { flow, constant } from 'fp-ts/lib/function'
import { SyncStatus } from '../utils/syncStatus'
import { ErrorInfo } from '../utils/ajaxError'

type Seconds = number

export interface SpaceFields {
  name: string
  description: string
  autoCheckout: O.Option<Seconds>
}

type SpaceId = string
interface ThingWithId {
  _id: SpaceId
}
export interface Space extends SpaceFields, ThingWithId {
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
export type NewSpace = SpaceFields & { status: SyncStatus }
export interface SpacesState {
  spaces: SpaceList
  newSpace?: NewSpace
  loadingStatus: SyncStatus
  deleteStatus: SyncStatus
}

export const listToRecord = (spaces: Space[]): Record<string, Space> =>
  R.fromFoldableMap(getLastSemigroup<Space>(), A.array)(spaces, s => [s._id, s])

const initialState: SpacesState = {
  spaces: listToRecord([]),
  loadingStatus: 'idle',
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
    createSpace (state: SpacesState, action: PayloadAction<SpaceFields>) {
      if (!state.newSpace && !existingName(state.spaces, action.payload.name)) {
        const newSpace: NewSpace = { ...action.payload, status: 'idle' }
        state.newSpace = newSpace
      }
    },
    updateSpace (
      state: SpacesState,
      action: PayloadAction<SpaceFields & ThingWithId>
    ) {
      state.spaces = flow(
        R.modifyAt(action.payload._id, (current: Space) => {
          let modified = current
          modified.name = action.payload.name
          modified.description = action.payload.description
          modified.autoCheckout = action.payload.autoCheckout
          return modified
        }),
        O.getOrElse(constant(state.spaces))
      )(state.spaces)
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
        autoCheckout: convertAutoCheckoutFromServer(serverRep.autoCheckout),
        createdAt: convertDateFromServer(serverRep.createdAt),
        updatedAt: convertDateFromServer(serverRep.updatedAt)
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

const convertAutoCheckoutFromServer = (serverValue: number) =>
  serverValue < 0 ? O.none : O.some(serverValue)

const convertDateFromServer = (serverValue: string) => Date.parse(serverValue)

export type CreateSpaceAction = ReturnType<typeof createSpace>
export type LoadSpacesAction = ReturnType<typeof loadSpaces>
export type LoadSpacesSucceededAction = ReturnType<typeof loadSpacesSucceeded>
export type DeleteSpaceAction = ReturnType<typeof deleteSpace>

export const {
  clearNewSpace,
  createSpace,
  updateSpace,
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
