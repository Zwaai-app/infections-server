import reducer, {
  Space,
  SpacesState,
  deleteSpace,
  updateSpace,
  listToRecord
} from './spacesSlice'
import * as O from 'fp-ts/lib/Option'

const space1: Space = {
  id: '1',
  name: 'one',
  description: 'one',
  autoCheckout: O.none
}
const space2: Space = {
  id: '2',
  name: 'two',
  description: 'two',
  autoCheckout: O.some(3600)
}
const space3: Space = {
  id: '3',
  name: 'three',
  description: 'three',
  autoCheckout: O.none
}

it('can update a space', () => {
  const state: SpacesState = { spaces: listToRecord([space1, space2, space3]) }
  const updatedSpace2 = {
    id: '2',
    name: 'updated name',
    description: 'updated description',
    autoCheckout: O.some(7200)
  }
  expect(reducer(state, updateSpace(updatedSpace2)).spaces).toEqual(
    listToRecord([space1, updatedSpace2, space3])
  )
})

it('ignores nonexisting space', () => {
  const state: SpacesState = { spaces: listToRecord([space1, space2, space3]) }
  const nonexisting = {
    id: '4',
    name: 'updated name',
    description: 'updated description',
    autoCheckout: O.some(7200)
  }
  expect(reducer(state, updateSpace(nonexisting)).spaces).toEqual(
    listToRecord([space1, space2, space3])
  )
})

it('can delete a space', () => {
  const state: SpacesState = {
    spaces: listToRecord([space1, space2, space3])
  }
  expect(reducer(state, deleteSpace(space2)).spaces).toEqual(
    listToRecord([space1, space3])
  )
})
