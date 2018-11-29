import { query } from "./query"

const taggedData =
  "id value tag isFocusWord isPunctuation isConnector isSentenceConnector wordId choiceSetId isUnfocused"
export const passageData = `id filteredSentences startIdx endIdx value isEnriched metadata { date author name source } tagged { ${taggedData} }`

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

export interface Passage {
  id: string
  tagged: Tag[]
  filteredSentences: number[]
  factoidOnCorrect: boolean
  matchIdx: number
  difficulty: number
  source: string
  title: string
  value: string
  status: string
}

export const fetchPassage = async (id: string): Promise<Passage | Error> => {
  const gqlQuery = `query { passage(id: "${id}") { id
    matchIdx
    title
    source
    status
    filteredSentences
    factoidOnCorrect
    tagged {
      id value tag isFocusWord isPunctuation isConnector isSentenceConnector wordId choiceSetId isUnfocused
    } 
  } }`
  return query(gqlQuery, "passage")
}

export const fetchEnrichedPassages = async (): Promise<Passage[] | Error> => {
  const gqlQuery = `query { enrichedPassages {
    id
    tagged {
      id value tag isFocusWord isPunctuation isConnector isSentenceConnector wordId choiceSetId isUnfocused
    }
    difficulty
    filteredSentences
  } }`
  return query(gqlQuery, "enrichedPassages")
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
