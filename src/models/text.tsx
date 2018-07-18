import { query } from "./query"

const TEXT_URL = "http://localhost:3002/parseText"

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
  const gqlQuery = `query { texts { id name source } }`
  return query(gqlQuery, "texts")
}

export const fetchText = async (id: string): Promise<any | Error> => {
  const gqlQuery = `query { text(id: "${id}") { id name source tokenized } }`
  return query(gqlQuery, "text")
}
