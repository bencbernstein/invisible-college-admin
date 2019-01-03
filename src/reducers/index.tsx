import { combineReducers } from "redux"
import { omit } from "lodash"

import { _mergeWith } from "../lib/helpers"

const entities = (state: any = {}, action: any) => {
  if (action.type === "REMOVE_ENTITY") {
    return omit(state, action.entity)
  }
  return action.response ? _mergeWith(state, action.response) : state
}

const errorMessage = (state = null, action: any) => action.error || state

const rootReducer = combineReducers({
  entities,
  errorMessage
})

export default rootReducer
