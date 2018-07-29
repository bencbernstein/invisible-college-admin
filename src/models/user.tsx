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
  bookmarks: Bookmark[]
}

export const loginUser = async (
  email: string,
  password: string
): Promise<any | Error> => {
  const gqlQuery = `mutation { loginUser(email: "${email}", password: "${password}") { id email firstName lastName } }`
  return query(gqlQuery, "loginUser")
}

export const fetchUser = async (id: string): Promise<any | Error> => {
  const gqlQuery = `query { user(id: "${id}") { email firstName lastName bookmarks { textId sentenceIdx } } }`
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
