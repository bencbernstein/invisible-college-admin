import { query } from "./query"

import { Tag } from "./text"

export interface Passage {
  id: string
  tagged: Tag[]
  filteredSentences: number[]
  matchIdx: number
  source: string
  title: string
  value: string
  status: string
}

export const savePassages = async (passages: string): Promise<any | Error> => {
  const gqlQuery = `mutation { savePassages(passages: "${passages}") }`
  return query(gqlQuery, "savePassages")
}

export const updatePassage = async (
  passage: Passage,
  status: string
): Promise<Text | Error> => {
  const gqlQuery = `mutation { updatePassage2(update: "${encodeURIComponent(
    JSON.stringify(passage)
  )}", status: "${status}") { id } }`
  return query(gqlQuery, "updatePassage2")
}

export const filterPassage = async (
  id: string,
  status: string,
  indices: number[]
): Promise<any | Error> => {
  const params = indices.length
    ? `(id: "${id}", status: "${status}", indices: "${indices.join(",")}")`
    : `(id: "${id}", status: "${status}")`
  const gqlQuery = `mutation { filterPassage${params} { id } }`
  return query(gqlQuery, "filterPassage")
}
