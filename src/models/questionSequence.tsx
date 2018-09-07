import { query } from "./query"

export interface QuestionSequence {
  id: string
  name: string
  questions: string[]
  fullQuestions?: any[]
}

export const fetchQuestionSequences = async (): Promise<
  QuestionSequence[] | Error
> => {
  const gqlQuery = `query {
    questionSequences {
      id
      name
      questions
    }
  }`
  return query(gqlQuery, "questionSequences")
}

export const fetchQuestionSequence = async (
  id: string
): Promise<QuestionSequence | Error> => {
  const gqlQuery = `query {
    questionSequence(id: "${id}") {
      id
      name
      questions
      fullQuestions {
        id
        TYPE
        sources {
          word {
            value
          }
          text {
            value
          }
        }
      }      
    }
  }`
  return query(gqlQuery, "questionSequence")
}

export const removeQuestionSequence = async (
  id: string
): Promise<QuestionSequence | Error> => {
  const gqlQuery = `mutation {
    removeQuestionSequence(id: "${id}") {
      id
    }
  }`
  return query(gqlQuery, "removeQuestionSequence")
}

export const createQuestionSequence = async (
  name: string,
  question: string
): Promise<QuestionSequence | Error> => {
  const gqlQuery = `mutation {
    createQuestionSequence(name: "${name}", question: "${question}") {
      id
      name
      questions
    }
  }`
  return query(gqlQuery, "createQuestionSequence")
}

export const updateQuestionSequence = async (
  id: string,
  questions: string[]
): Promise<QuestionSequence | Error> => {
  const gqlQuery = `mutation {
    updateQuestionSequence(id: "${id}", questions: "${encodeURIComponent(
    JSON.stringify(questions)
  )}") {
      id
      name
      questions
    }
  }`
  return query(gqlQuery, "updateQuestionSequence")
}
