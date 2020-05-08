import * as O from 'fp-ts/lib/Option'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Seconds = number

export interface Space {
  id: string
  name: string
  description: string
  autoCheckout: O.Option<Seconds>
}

export interface SpacesState {
  list: Space[]
}

const initialState: SpacesState = {
  list: [
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
}

export const spacesSlice = createSlice({
  name: 'spaces',
  initialState,
  reducers: {
    deleteSpace (state: SpacesState, action: PayloadAction<Space>) {
      state.list = state.list.filter(s => s.id !== action.payload.id)
    }
  }
})

export const { deleteSpace } = spacesSlice.actions

export default spacesSlice.reducer
