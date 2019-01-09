import { combineReducers } from "redux"
import { omit } from "lodash"

import { _mergeWith } from "../lib/helpers"

const entities = (state: any = {}, action: any) => {
  if (action.type === "REMOVE_ENTITY") {
    return omit(state, action.entity)
  }

  if (action.type === "SET_CURRICULUM") {
    localStorage.setItem("curriculum", action.response.curriculum.id)
  }

  return action.response ? _mergeWith(state, action.response) : state
}

const errorMessage = (state = null, action: any) => action.error || state

const rootReducer = combineReducers({
  entities,
  errorMessage
})

export default rootReducer
