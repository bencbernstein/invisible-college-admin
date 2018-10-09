import { query } from "./query"

import CONFIG from "../lib/config"

const TEXT_URL = CONFIG.API_URL + "/parseText"

export interface Passage {
  id: string
  startIdx: number
  endIdx: number
  value: string
  tagged: Tag[]
  sentences: Tag[][]
  filteredSentences: number[]
  isEnriched?: boolean
}

export interface Tag {
  value?: string
  tag?: string
  isFocusWord?: boolean
  isPunctuation?: boolean
  isSentenceConnector?: boolean
  isConnector?: boolean
  wordId?: string
  choiceSetId?: string
  isUnfocused?: boolean
}

export interface Text {
  id: string
  isPreFiltered: boolean
  name: string
  source: string
  tokenized: any
  passages: Passage[]
  passagesCount: number
  unenrichedPassagesCount: number
}

const taggedData =
  "id value tag isFocusWord isPunctuation isConnector isSentenceConnector wordId choiceSetId isUnfocused"
export const passageData = `id filteredSentences startIdx endIdx value isEnriched metadata { date author name source } tagged { ${taggedData} }`

const parseTextQuery = (formData: FormData, params: string): any | Error =>
  fetch(TEXT_URL + params, {
    body: formData,
    method: "POST"
  }).then(res => res.json())

export const parseText = async (
  file: File,
  name: string,
  source: string
): Promise<any | Error> => {
  const formData = new FormData()
  formData.append("file", file)
  const params = `?name=${name}&source=${source}`
  return parseTextQuery(formData, params)
}

export const fetchTexts = async (): Promise<Text[] | Error> => {
  const gqlQuery = `query { texts { id name source passagesCount unenrichedPassagesCount } }`
  return query(gqlQuery, "texts")
}

export const fetchText = async (id: string): Promise<Text | Error> => {
  const gqlQuery = `query { text(id: "${id}") { id name author date isPreFiltered source tokenized passages { ${passageData} } } }`
  return query(gqlQuery, "text")
}

export const addPassages = async (
  id: string,
  ranges: number[][]
): Promise<Text | Error> => {
  const gqlQuery = `mutation { addPassages(id: "${id}", ranges: ${JSON.stringify(
    ranges
  )}) { passages { ${passageData} } } }`
  return query(gqlQuery, "addPassages")
}

export const removePassage = async (
  textId: string,
  passageId: string
): Promise<any | Error> => {
  const gqlQuery = `mutation { removePassage(textId: "${textId}", passageId: "${passageId}") { id } }`
  return query(gqlQuery, "removePassage")
}

export const updatePassage = async (
  passage: Passage
): Promise<Text | Error> => {
  const gqlQuery = `mutation { updatePassage(update: "${encodeURIComponent(
    JSON.stringify(passage)
  )}") { id } }`
  return query(gqlQuery, "updatePassage")
}

export const removeText = async (id: string): Promise<any | Error> => {
  const gqlQuery = `mutation {
    removeText(id: "${id}") {
      id
    }
  }`
  return query(gqlQuery, "removeText")
}
