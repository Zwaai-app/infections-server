import { Option } from 'fp-ts/lib/Option'
import { createSlice } from '@reduxjs/toolkit'

type Seconds = number

export interface Space {
  id: string
  name: string
  description: string
  autoCheckout: Option<Seconds>
}

export interface SpacesState {
  list: Space[]
}

const initialState: SpacesState = { list: [] }

export const spacesSlice = createSlice({
  name: 'spaces',
  initialState,
  reducers: {}
})

export default spacesSlice.reducer
