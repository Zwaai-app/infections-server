import { storeNewSpaceEpic, Actions as CreateActions } from './epics/newSpace'
import { updateSpaceEpic, Actions as UpdateActions } from './epics/updateSpace'
import { deleteSpaceEpic, Actions as DeleteActions } from './epics/deleteSpace'
import {
  loadSpacesEpic,
  resetAfterLoadSuccess,
  Actions as LoadActions
} from './epics/loadSpaces'

export type Actions =
  | CreateActions
  | LoadActions
  | UpdateActions
  | DeleteActions

export const allEpics = [
  storeNewSpaceEpic,
  updateSpaceEpic,
  deleteSpaceEpic,
  loadSpacesEpic,
  resetAfterLoadSuccess
]
