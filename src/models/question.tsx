import { query } from "./query"

interface Sources {
  word?: string
}

export interface PromptPart {
  value: string
  highlight: boolean
}

export interface AnswerPart {
  value: string
  prefill: boolean
}

export interface Question {
  TYPE: string
  prompt: PromptPart[]
  answer: AnswerPart[]
  redHerrings: string[]
  sources: Sources
}

export const fetchQuestionsForWord = async (
  id: string
): Promise<Question[] | Error> => {
  const gqlQuery = `query {
    questionsForWord(id: "${id}") {
      TYPE
      prompt {
        value
        highlight
      }
      answer {
        value
        prefill
      }
      redHerrings
      sources {
        word
      }
    }
  }`
  return query(gqlQuery, "questionsForWord")
}
