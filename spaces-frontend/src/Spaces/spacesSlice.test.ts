import reducer, {
  Space,
  SpacesState,
  deleteSpace,
  updateSpace,
  listToRecord,
  SpaceFields,
  createSpace,
  clearNewSpace,
  storeNewSpaceStarted,
  storeNewSpaceSucceeded,
  storeNewSpaceFailed,
  SpaceList,
  NewSpace,
  loadSpaces,
  loadSpacesSucceeded,
  loadSpacesFailed,
  loadSpacesReset
} from './spacesSlice'
import * as O from 'fp-ts/lib/Option'
import { SyncStatus } from '../utils/syncStatus'

const space1: Space = {
  _id: '1',
  name: 'one',
  description: 'one',
  autoCheckout: O.none
}
const space2: Space = {
  _id: '2',
  name: 'two',
  description: 'two',
  autoCheckout: O.some(3600)
}
const space3: Space = {
  _id: '3',
  name: 'three',
  description: 'three',
  autoCheckout: O.none
}

it('can create a space', () => {
  const state = spaceState({ spaces: listToRecord([space1]) })
  const newSpaceFields: SpaceFields = {
    name: 'new',
    description: 'also new',
    autoCheckout: O.some(1800)
  }
  expect(reducer(state, createSpace(newSpaceFields)).newSpace).toEqual({
    ...newSpaceFields,
    status: 'idle'
  })
})

it('ignores create when already creating one', () => {
  const state = spaceState({ newSpace: { ...space1, status: 'inProgress' } })
  const newSpaceFields: SpaceFields = {
    name: 'new',
    description: 'also new',
    autoCheckout: O.some(1800)
  }
  expect(reducer(state, createSpace(newSpaceFields)).newSpace?.name).toEqual(
    space1.name
  )
})

it('cannot create a space with an existing name', () => {
  const state = spaceState({ spaces: listToRecord([space1]) })
  const newSpaceFields: SpaceFields = {
    name: space1.name,
    description: 'also new',
    autoCheckout: O.some(1800)
  }
  expect(reducer(state, createSpace(newSpaceFields)).newSpace).toBeUndefined()
})

it('can update a space', () => {
  const state = spaceState({ spaces: listToRecord([space1, space2, space3]) })
  const updatedSpace2 = {
    _id: '2',
    name: 'updated name',
    description: 'updated description',
    autoCheckout: O.some(7200)
  }
  expect(reducer(state, updateSpace(updatedSpace2)).spaces).toEqual(
    listToRecord([space1, updatedSpace2, space3])
  )
})

it('ignores nonexisting space', () => {
  const state = spaceState({ spaces: listToRecord([space1, space2, space3]) })
  const nonexisting = {
    _id: '4',
    name: 'updated name',
    description: 'updated description',
    autoCheckout: O.some(7200)
  }
  expect(reducer(state, updateSpace(nonexisting)).spaces).toEqual(
    listToRecord([space1, space2, space3])
  )
})

it('can delete a space', () => {
  const state = spaceState({
    spaces: listToRecord([space1, space2, space3])
  })
  expect(reducer(state, deleteSpace(space2)).spaces).toEqual(
    listToRecord([space1, space3])
  )
})

it('can clear state about new space being created', () => {
  const state = spaceState({
    newSpace: { ...space1, status: 'inProgress' }
  })
  expect(reducer(state, clearNewSpace()).newSpace).toBeUndefined()
})

describe('store new space', () => {
  it('sets in progress when store started', () => {
    const state = spaceState({
      newSpace: { ...space1, status: 'idle' }
    })
    expect(reducer(state, storeNewSpaceStarted()).newSpace?.status).toEqual(
      'inProgress'
    )
  })

  it('sets status succeeded when store succeeds', () => {
    const state = spaceState({
      newSpace: { ...space1, status: 'inProgress' }
    })
    expect(reducer(state, storeNewSpaceSucceeded()).newSpace?.status).toEqual(
      'success'
    )
  })

  it('sets error when store fails', () => {
    const state = spaceState({
      newSpace: { ...space1, status: 'inProgress' }
    })
    expect(
      reducer(state, storeNewSpaceFailed('some error')).newSpace?.status
    ).toEqual({ error: 'some error' })
  })
})

describe('load spaces list', () => {
  it('sets status when loading', () => {
    const state = spaceState({ loadingStatus: 'idle' })
    expect(reducer(state, loadSpaces()).loadingStatus).toEqual('inProgress')
  })

  it('sets status and spaces when succeeded', () => {
    const state = spaceState({
      spaces: listToRecord([space1]),
      loadingStatus: 'inProgress'
    })
    const space2ServerRep = {
      ...space2,
      autoCheckout: 3600
    }
    const space3ServerRep = {
      ...space3,
      autoCheckout: -1
    }
    const newState = reducer(
      state,
      loadSpacesSucceeded([space2ServerRep, space3ServerRep])
    )
    expect(newState.loadingStatus).toEqual('success')
    expect(newState.spaces).toEqual(listToRecord([space2, space3]))
  })

  it('sets status on error', () => {
    const state = spaceState({
      spaces: listToRecord([space1, space2]),
      loadingStatus: 'inProgress'
    })
    const newState = reducer(state, loadSpacesFailed('some error'))
    expect(newState.loadingStatus).toEqual({ error: 'some error' })
    expect(newState.spaces).toEqual(listToRecord([space1, space2]))
  })

  it('can reset loading status', () => {
    const state = spaceState({ loadingStatus: 'inProgress' })
    expect(reducer(state, loadSpacesReset()).loadingStatus).toEqual('idle')
  })
})

function spaceState ({
  spaces,
  newSpace,
  loadingStatus
}: {
  spaces?: SpaceList
  newSpace?: NewSpace
  loadingStatus?: SyncStatus
} = {}): SpacesState {
  return {
    spaces: spaces || {},
    newSpace,
    loadingStatus: loadingStatus || 'idle'
  }
}
