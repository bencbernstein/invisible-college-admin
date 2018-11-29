import { query } from "./query"

import CONFIG from "../lib/config"

const TEXT_URL = CONFIG.API_URL + "/parseText"

export interface Text {
  id: string
  title: string
}

const parseTextQuery = (formData: FormData, params: string): any | Error =>
  fetch(TEXT_URL + params, {
    body: formData,
    method: "POST"
  }).then(res => res.json())

export const parseTexts = async (files: File[]): Promise<any | Error> => {
  const formData = new FormData()
  files.forEach((file: File, i: number) => formData.append(`file-${i}`, file))
  return parseTextQuery(formData, `?count=${files.length}`)
}

export const fetchTexts = async (index: string): Promise<Text[] | Error> =>
  query(`query { texts(index: "${index}") { id title } }`, "texts")

export const fetchText = async (id: string): Promise<Text | Error> =>
  query(`query { text(id: "${id}") { id title } }`, "text")

export const updateText = async (
  id: string,
  update: any
): Promise<boolean | Error> =>
  query(
    `mutation { updateText(id: "${id}", update: "${encodeURIComponent(
      JSON.stringify(update)
    )}") }`,
    "updateText"
  )

export const removeText = async (id: string): Promise<any | Error> => {
  const gqlQuery = `mutation {
    removeText(id: "${id}") {
      id
    }
  }`
  return query(gqlQuery, "removeText")
}
