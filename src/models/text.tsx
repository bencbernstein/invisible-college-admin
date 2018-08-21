import { query } from "./query"

import CONFIG from "../lib/config"

const TEXT_URL = CONFIG.API_URL + "/parseText"

export interface Sentence {
  sentence: string
  found: string[]
}

export interface Passage {
  id: string
  startIdx: number
  endIdx: number
  value: string
  found: string[]
  tagged: Tag[]
  isEnriched: boolean
}

export interface Tag {
  value: string
  tag: string
  isFocusWord: boolean
  isPunctuation: boolean
}

export interface Text {
  id: string
  isPreFiltered: boolean
  name: string
  source: string
  tokenized: Sentence[]
  passages: Passage[]
  passagesCount: number
  unenrichedPassagesCount: number
}

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

export const fetchTexts = async (): Promise<any | Error> => {
  const gqlQuery = `query { texts { id name source passagesCount unenrichedPassagesCount } }`
  return query(gqlQuery, "texts")
}

export const fetchText = async (id: string): Promise<any | Error> => {
  const gqlQuery = `query { text(id: "${id}") { id name isPreFiltered source tokenized passages { id startIdx endIdx value found isEnriched tagged { id value tag isFocusWord isPunctuation } } } }`
  return query(gqlQuery, "text")
}

export const addPassages = async (
  id: string,
  ranges: number[][]
): Promise<any | Error> => {
  const gqlQuery = `mutation { addPassages(id: "${id}", ranges: ${JSON.stringify(
    ranges
  )}) { passages { id startIdx endIdx value found tagged { id value tag isFocusWord isPunctuation } } } }`
  return query(gqlQuery, "addPassages")
}

export const removePassage = async (
  textId: string,
  passageId: string
): Promise<any | Error> => {
  const gqlQuery = `mutation { removePassage(textId: "${textId}", passageId: "${passageId}") { id } }`
  return query(gqlQuery, "removePassage")
}

export const updatePassage = async (passage: Passage): Promise<any | Error> => {
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
