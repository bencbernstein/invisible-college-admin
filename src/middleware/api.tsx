import CONFIG from "../lib/config"

const GQL_URL = CONFIG.API_URL + "/graphql"

export const CALL_API = "Call API"

const callApi = (query: string, schema: string, route: string) => {
  const body = JSON.stringify({ query })
  const headers = { "Content-Type": "application/json" }
  const method = "POST"

  return fetch(GQL_URL, { body, headers, method }).then(res =>
    res
      .json()
      .then(json => {
        const result: any = { isLoading: false }
        console.log(json)
        if (json.errors && json.errors.length) {
          const { message } = json.errors[0]
          console.log("ERR: " + message)
          return Promise.reject(message)
        }

        if (json.data[route]) {
          result[schema] = json.data[route]
        }

        return result
      })
      .catch(error => Promise.reject(error.message))
  )
}

export default (store: any) => (next: any) => (action: any) => {
  const callAPI = action[CALL_API]

  if (typeof callAPI === "undefined") {
    return next(action)
  }

  const { query, schema, types, route } = callAPI

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error("Expected an array of three action types.")
  }
  if (!types.every(type => typeof type === "string")) {
    throw new Error("Expected action types to be strings.")
  }

  const actionWith = (data: any) => {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [requestType, successType, failureType] = types
  next(actionWith({ type: requestType }))

  return callApi(query, schema, route).then(
    (response: any) =>
      next(
        actionWith({
          response,
          type: successType
        })
      ),
    (error: any) =>
      next(
        actionWith({
          type: failureType,
          error: error || "Something bad happened."
        })
      )
  )
}
