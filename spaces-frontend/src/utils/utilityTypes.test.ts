import { PayloadType, PayloadParameterType } from './utilityTypes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SliceState {
  foo: string
}

const slice = createSlice({
  name: 'test',
  initialState: { foo: '' },
  reducers: {
    // tslint:disable-next-line: no-empty
    testAction (_state: SliceState, _action: PayloadAction<SliceState>) {}
  }
})
const { testAction } = slice.actions
type TestAction = ReturnType<typeof testAction>

/*
 * The purpose of these tests is to see whether they type check,
 * not so much the runtime behavior.
 */

it('type checks PayloadParameterType', () => {
  let x: PayloadParameterType<typeof testAction> = { foo: '' }
  const y: SliceState = { foo: '' }
  x = y
  expect(typeof x).toBe(typeof y)
})

it('type checks PayloadType', () => {
  let x: PayloadType<TestAction> = { foo: '' }
  const y: SliceState = { foo: '' }
  x = y
  expect(typeof x).toBe(typeof y)
})
