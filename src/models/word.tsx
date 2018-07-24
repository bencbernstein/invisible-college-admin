import { query } from "./query"

export const fetchWords = async (
  first: number,
  after?: string
): Promise<any | Error> => {
  const gqlQuery = after
    ? `query { words(first: ${first}, after: "${after}") { id value } }`
    : `query { words(first: ${first}) { id value } }`
  return query(gqlQuery, "words")
}

export const fetchWord = async (id: string): Promise<any | Error> => {
  const gqlQuery = `query {
    word(id: "${id}") {
      id
      value
      isDecomposable
      components {
        value
        isRoot
      }
      definition {
        value
        highlight
      }
      obscurity
    }
  }`
  return query(gqlQuery, "word")
}

export const enrichWord = async (value: string): Promise<any | Error> => {
  const gqlQuery = `mutation {
    enrichWord(value: "${value}") {
      value
      definition
      synonyms
      tags
    }
  }`
  return query(gqlQuery, "enrichWord")
}

export const addWord = async (value: string): Promise<any | Error> => {
  const gqlQuery = `mutation {
    addWord(value: "${value}") {
      id
    }
  }`
  return query(gqlQuery, "addWord")
}

export const removeWord = async (id: string): Promise<any | Error> => {
  const gqlQuery = `mutation {
    removeWord(id: "${id}") {
      id
    }
  }`
  return query(gqlQuery, "removeWord")
}
