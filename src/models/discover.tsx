import CONFIG from "../lib/config"

const API_URL = CONFIG.DISCOVER_API_URL
const headers = { "Content-Type": "application/json" }

export interface PredictiveCorpusResult {
  name: string
  checked: boolean
  results?: string[]
}

export interface PredictiveCorpus {
  words: PredictiveCorpusResult
  ngrams: PredictiveCorpusResult
  people: PredictiveCorpusResult
  places: PredictiveCorpusResult
  organizations: PredictiveCorpusResult
}

export const PREDICTIVE_CORPUS = {
  words: { name: "Significant words", checked: false },
  ngrams: { name: "Significant phrases", checked: false },
  people: { name: "People", checked: false },
  places: { name: "Places", checked: false },
  organizations: { name: "Organizations", checked: false }
}

export interface PassageResult {
  context: string[]
  matchIdx: number
  title: string
  matches: string[]
}

export const fetchArticleLinks = (
  search: string,
  cachingId?: string
): any | Error =>
  fetch(
    `${API_URL}/wikipedia-links?search=${search}${
      cachingId ? `&last_job=${cachingId}` : ""
    }`,
    {
      headers,
      method: "GET"
    }
  ).then(res => res.json())

export const fetchPassages = (
  wikipediaTitles: string[],
  searchWords: string[]
): any | Error =>
  fetch(`${API_URL}/wikipedia-passages`, {
    headers,
    method: "POST",
    body: JSON.stringify({
      wikipedia_titles: wikipediaTitles,
      search_words: searchWords
    })
  }).then(res => res.json())

export const fetchPredictiveCorpus = (titles: string[]): any | Error =>
  fetch(`${API_URL}/predictive-corpus`, {
    headers,
    method: "POST",
    body: JSON.stringify({
      wikipedia_titles: titles
    })
  }).then(res => res.json())

export const fetchTask = (id: string): any | Error =>
  fetch(`${API_URL}/tasks/${id}`, {
    headers,
    method: "GET"
  }).then(res => res.json())
