const GQL_URL = "http://localhost:3002/graphql"

export const query = (gqlQuery: string, name: string): any | Error =>
  fetch(GQL_URL, {
    body: JSON.stringify({ query: gqlQuery }),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  })
    .then(res => res.json())
    .then(json => {
      if (json.errors && json.errors.length) {
        return Error(json.errors[0].message)
      }
      return json.data[name]
    })
