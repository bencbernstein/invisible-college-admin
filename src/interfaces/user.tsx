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
  accessLevel: number
  wordsLearned: number
  passagesRead: number
  rank: number
  level: number
  bookmarks: Bookmark[]
}

export interface Rank {
  no: number
  questionsAnswered: number
  id: string
  initials: string
}

export interface StatsResult {
  user: User
  ranks: Rank[]
}

export const userAttrs =
  "id email firstName lastName questionsAnswered wordsLearned passagesRead rank level"
