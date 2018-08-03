import { query } from "./query"

import { Word } from "../components/word"

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
      synonyms
      components {
        value
        isRoot
      }
      definition {
        value
        highlight
      }
      tags {
        value
        id
        choiceSetIds
      }
      unverified {
        definition
        tags
        synonyms
      }
      obscurity
      images
    }
  }`
  return query(gqlQuery, "word")
}

export const fetchKeywords = async (): Promise<any | Error> => {
  const gqlQuery = `query {
    keywords {
      words
      choices
    }
  }`
  return query(gqlQuery, "keywords")
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

export const updateWord = async (word: Word): Promise<any | Error> => {
  const encoded = encodeURIComponent(JSON.stringify(word))
  const gqlQuery = `mutation {
    updateWord(word: "${encoded}") {
      id
    }
  }`
  return query(gqlQuery, "updateWord")
}
