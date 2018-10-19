import { query } from "./query"

export interface Bookmark {
  textId: string
  sentenceIdx: number
}

export interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  questionsAnswered: number
  wordsLearned: number
  passagesRead: number
  rank: number
  level: number
  bookmarks: Bookmark[]
}

const attrs =
  "id email firstName lastName questionsAnswered wordsLearned passagesRead rank level"

export const loginUser = async (
  email: string,
  password: string
): Promise<any | Error> => {
  const gqlQuery = `mutation { loginUser(email: "${email}", password: "${password}") { ${attrs} } }`
  return query(gqlQuery, "loginUser")
}

export const createUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<any | Error> => {
  const gqlQuery = `mutation { createUser(email: "${email}", password: "${password}", firstName: "${firstName}", lastName: "${lastName}") { ${attrs} } }`
  return query(gqlQuery, "createUser")
}

export const fetchUser = async (id: string): Promise<any | Error> => {
  const gqlQuery = `query { user(id: "${id}") { ${attrs} bookmarks { textId sentenceIdx } } }`
  return query(gqlQuery, "user")
}

export const saveBookmark = async (
  userId: string,
  textId: string,
  sentenceIdx: number
): Promise<any | Error> => {
  const gqlQuery = `mutation { saveBookmark(userId: "${userId}", textId: "${textId}", sentenceIdx: ${sentenceIdx}) { id } }`
  return query(gqlQuery, "saveBookmark")
}

export const fetchUserFromStorage = (): User | undefined => {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : undefined
}

export const saveUserToStorage = (user: User) =>
  localStorage.setItem("user", JSON.stringify(user))
