import { query } from "./query"

export const fetchChoiceSets = async (
  attrs: string[]
): Promise<any | Error> => {
  const gqlQuery = `query { choiceSets { ${attrs.join(" ")} } }`
  return query(gqlQuery, "choiceSets")
}

export const addChoice = async (
  id: string,
  value: string
): Promise<any | Error> => {
  const gqlQuery = `mutation { addChoice(id: "${id}", value: "${value}") { id name category choices } }`
  return query(gqlQuery, "addChoice")
}

export const removeChoice = async (
  id: string,
  value: string
): Promise<any | Error> => {
  const gqlQuery = `mutation { removeChoice(id: "${id}", value: "${value}") { id name category choices } }`
  return query(gqlQuery, "removeChoice")
}

export const removeChoiceSet = async (id: string): Promise<any | Error> => {
  const gqlQuery = `mutation { removeChoiceSet(id: "${id}") { id } }`
  return query(gqlQuery, "removeChoiceSet")
}
