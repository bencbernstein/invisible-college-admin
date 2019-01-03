export interface User {
  id: string
  email: string
  admin: boolean
  password: string
  firstName: string
  lastName: string
  questionsAnswered: number
  accessLevel: number
  wordsLearned: number
  passagesRead: number
  rank: number
  level: number
  curricula: string[]
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
  "id email admin firstName lastName questionsAnswered wordsLearned passagesRead rank level curricula"
