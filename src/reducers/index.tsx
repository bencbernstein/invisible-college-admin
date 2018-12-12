import { combineReducers } from "redux"
import { get, merge } from "lodash"

import { _mergeWith } from "../lib/helpers"

const ERRORS = {}

const entities = (state: any = {}, action: any) => {
  const { response } = action

  if (response) {
    return _mergeWith(state, response)
  }

  return merge(state)
}

const errorMessage = (state = null, action: any) => {
  if (action.error) {
    const error = get(ERRORS, action.error, "Something bad happened.")
    return merge(state, { error })
  }

  return null
}

const rootReducer = combineReducers({
  entities,
  errorMessage
})

export default rootReducer
