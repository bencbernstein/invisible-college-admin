import { query } from "./query"

export interface Source {
  value: string
  id: string
}

export interface Sources {
  word?: Source
  text?: Source
}

export interface PromptPart {
  value?: string
  highlight?: boolean
  isSentenceConnector?: boolean
}

export interface AnswerPart {
  value?: string
  prefill?: boolean
  isSentenceConnector?: boolean
}

export interface Question {
  id: string
  TYPE: string
  prompt: PromptPart[]
  answer: AnswerPart[]
  redHerrings: string[]
  sources: Sources
}

const sources = `
  sources {
    text {
      id
      value
    }
    word {
      id
      value
    }
  }
`

export const questionFragment = `
  id
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
  ${sources}
`

const slim = `
  id
  TYPE
  ${sources}
`

export const fetchQuestion = async (id: string): Promise<Question | Error> => {
  const gqlQuery = `query {
    question(id: "${id}") {
      ${questionFragment}
    }
  }`
  return query(gqlQuery, "question")
}

export const fetchQuestions = async (
  questionType?: string,
  after?: string
): Promise<Question[] | Error> => {
  const params =
    questionType && after
      ? `(questionType: "${questionType}", after: "${after}")`
      : after
        ? `(after: "${after}")`
        : questionType
          ? `(questionType: "${questionType}")`
          : ""
  const gqlQuery = `query {
    questions${params} {
      ${slim}
    }
  }`
  return query(gqlQuery, "questions")
}

export const fetchQuestionsForText = async (
  id: string
): Promise<Question[] | Error> => {
  const gqlQuery = `query {
    questionsForText(id: "${id}") {
      ${questionFragment}
    }
  }`
  return query(gqlQuery, "questionsForText")
}

export const fetchQuestionsForWord = async (
  id: string
): Promise<Question[] | Error> => {
  const gqlQuery = `query {
    questionsForWord(id: "${id}") {
      ${questionFragment}
    }
  }`
  return query(gqlQuery, "questionsForWord")
}
