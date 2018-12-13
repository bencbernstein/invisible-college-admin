import { combineReducers } from "redux"

import { _mergeWith } from "../lib/helpers"

const entities = (state: any = {}, action: any) =>
  action.response ? _mergeWith(state, action.response) : state

const errorMessage = (state = null, action: any) => action.error || state

const rootReducer = combineReducers({
  entities,
  errorMessage
})

export default rootReducer
