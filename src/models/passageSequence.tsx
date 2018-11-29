import { query } from "./query"

import { Passage, passageData } from "./passage"

export interface PassageSequence {
  id: string
  name: string
  count: number
  passages: any[]
}

const allFields = "id name count passages"

export const fetchPassageSequences = async (): Promise<
  PassageSequence[] | Error
> => {
  const gqlQuery = `query { passageSequences { ${allFields} } }`
  return query(gqlQuery, "passageSequences")
}

export const fetchPassageSequence = async (
  id: string
): Promise<Passage[] | Error> => {
  const gqlQuery = `query { passageSequence(id: "${id}") { ${passageData} } }`
  return query(gqlQuery, "passageSequence")
}

export const updatePassageSequence = async (
  id: string,
  passages: string[]
): Promise<PassageSequence | Error> => {
  const encoded = encodeURIComponent(JSON.stringify(passages))
  const gqlQuery = `mutation { updatePassageSequence(id: "${id}", passages: "${encoded}") { ${allFields} } }`
  return query(gqlQuery, "updatePassageSequence")
}

export const addPassageToPassageSequence = async (
  id: string,
  passageId: string
): Promise<PassageSequence | Error> => {
  const gqlQuery = `mutation {
  addPassageToPassageSequence(id: "${id}", passageId: "${passageId}") {
    ${allFields}
  }
}`
  return query(gqlQuery, "addPassageToPassageSequence")
}

export const removePassageFromPassageSequence = async (
  id: string,
  passageId: string
): Promise<PassageSequence | Error> => {
  const gqlQuery = `mutation {
    removePassageFromPassageSequence(id: "${id}", passageId: "${passageId}") {
    ${allFields}
  }
}`
  return query(gqlQuery, "removePassageFromPassageSequence")
}
