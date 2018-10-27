import { query } from "./query"
import { User } from "./user"

export interface Source {
  value: string
  id: string
}

export interface Sources {
  word?: Source
  passage?: Source
}

export interface PromptPart {
  value?: string
  highlight?: boolean
  hide?: boolean
  isSentenceConnector?: boolean
}

export interface AnswerPart {
  value?: string
  prefill?: boolean
  isSentenceConnector?: boolean
}

export interface InteractivePart {
  correct: boolean
  value: string
}

export interface Question {
  id: string
  TYPE: string
  prompt: PromptPart[]
  answer: AnswerPart[]
  redHerrings: string[]
  passageOrWord: string
  interactive: InteractivePart[]
  sources: Sources
  answerCount: number
  experience?: number
}

export interface QuestionLog {
  type: string
  value: string
  id: string
  correct: boolean
}

const sources = `
  sources {
    passage {
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
  passageOrWord
  prompt {
    value
    highlight
    hide
  }
  answer {
    value
    prefill
  }
  interactive {
    value
    correct
  }
  answerCount
  redHerrings
  ${sources}
  experience
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

export const questionsForUser = async (id: string): Promise<string | Error> =>
  query(`query { questionsForUser(id: "${id}") }`, "questionsForUser")

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

export const saveQuestionsForUser = async (
  id: string,
  questions: QuestionLog[]
): Promise<User | Error> => {
  const encoded = encodeURIComponent(JSON.stringify(questions))
  const gqlQuery = `mutation {
    saveQuestionsForUser(id: "${id}", questions: "${encoded}") {
      id
    }
  }`
  return query(gqlQuery, "saveQuestionsForUser")
}

export interface QuestionTypeCount {
  type: string
  count: number
}

export const fetchQuestionTypeCounts = async (): Promise<
  QuestionTypeCount[] | Error
> => {
  const gqlQuery = `query {
    questionTypeCounts {
      type
      count
    }
  }`
  return query(gqlQuery, "questionTypeCounts")
}

export const questionsForType = async (type: string): Promise<string | Error> =>
  query(`query { questionsForType(type: "${type}") }`, "questionsForType")
