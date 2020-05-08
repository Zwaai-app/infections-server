import reducer, { Space, SpacesState, deleteSpace } from './spacesSlice'
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

it('can delete a space', () => {
  const state: SpacesState = {
    list: [space1, space2, space3]
  }
  expect(reducer(state, deleteSpace(space2)).list).toEqual([space1, space3])
})
