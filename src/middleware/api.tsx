import CONFIG from "../lib/config"

const GQL_URL = CONFIG.API_URL + "/graphql"

export const CALL_API = "Call API"

const callApi = (
  query: string,
  schema: undefined | string | string[],
  route: string,
  parseJson: boolean = false
) => {
  const body = JSON.stringify({ query })
  const headers = { "Content-Type": "application/json" }
  const method = "POST"

  return fetch(GQL_URL, { body, headers, method }).then(res =>
    res
      .json()
      .then(json => {
        const { data, errors } = json
        // console.log(data)
        const result: any = { isLoading: false }

        if (errors && errors.length) {
          const error = errors[0].message
          console.log("ERR: " + error)
          throw new Error(error)
        }

        if (data[route] && schema) {
          if (Array.isArray(schema)) {
            schema.forEach(
              s =>
                (result[s] = parseJson
                  ? JSON.parse(data[route])
                  : data[route][s])
            )
          } else {
            result[schema] = parseJson ? JSON.parse(data[route]) : data[route]
          }
        }

        return result
      })
      .catch(error => {
        throw new Error(error.message)
      })
  )
}

export default (store: any) => (next: any) => (action: any) => {
  const callAPI = action[CALL_API]

  if (typeof callAPI === "undefined") {
    return next(action)
  }

  const { query, schema, types, route, parseJson } = callAPI

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

  return callApi(query, schema, route, parseJson)
    .then((response: any) =>
      next(
        actionWith({
          response,
          type: successType
        })
      )
    )
    .catch((error: any) =>
      next(
        actionWith({
          type: failureType,
          error: error ? error.message : "Something bad happened."
        })
      )
    )
}
