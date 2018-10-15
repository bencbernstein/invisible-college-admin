import { query } from "./query"

import { Passage } from "./passage"

export interface Keywords {
  choices: any
  words: any
}

export interface Component {
  value: string
  isRoot: boolean
}

export interface DefinitionPart {
  value: string
  highlight: boolean
}

export interface Unverified {
  definition?: string
  tags?: string[]
  synonyms?: string[]
}

export interface Tag {
  id?: string
  value: string
  choiceSetIds?: string[]
}

export interface Word {
  id: string
  value: string
  synonyms: string[]
  isDecomposable: boolean
  components?: Component[]
  definition: DefinitionPart[]
  otherForms: string[]
  obscurity: number
  images: string[]
  lcd: string
  tags: Tag[]
  unverified: Unverified
  unfilteredPassagesCount: number
  rejectedPassagesCount: number
  acceptedPassagesCount: number
  enrichedPassagesCount: number
}

const slim = [
  "id",
  "value",
  "unfilteredPassagesCount",
  "rejectedPassagesCount",
  "acceptedPassagesCount",
  "enrichedPassagesCount"
].join(" ")

export const fetchWords = async (
  first: number,
  startingWith: string,
  sortBy: string
): Promise<Word[] | Error> => {
  const gqlQuery = `query { words(first: ${first}, startingWith: "${startingWith}", sortBy: "${sortBy}") { ${slim} } }`
  return query(gqlQuery, "words")
}

export const fetchWordsByValues = async (
  values: string[]
): Promise<Word[] | Error> =>
  query(
    `query { wordsByValues (values: "${values.join(",")}") { id value lcd } }`,
    "wordsByValues"
  )

export const fetchWord = async (id: string): Promise<Word | Error> => {
  const gqlQuery = `query {
    word(id: "${id}") {
      id
      value
      isDecomposable
      synonyms
      otherForms
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
    keywords
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

export const wordsToEnrich = async (attr: string): Promise<Word[] | Error> => {
  const gqlQuery = `query {
    wordsToEnrich(attr: "${attr}") {
      id
    }
  }`
  return query(gqlQuery, "wordsToEnrich")
}

export const passagesForWord = async (
  value: string
): Promise<Passage[] | Error> => {
  const gqlQuery = `query {
    passagesForWord(value: "${value}") {
      id
      status
    }
  }`
  return query(gqlQuery, "passagesForWord")
}

export const recommendPassageQueues = async (
  type: string
): Promise<string[] | Error> => {
  const gqlQuery = `query {
    recommendPassageQueues(type: "${type}")
  }`
  return query(gqlQuery, "recommendPassageQueues")
}
