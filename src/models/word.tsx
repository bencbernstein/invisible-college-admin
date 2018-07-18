import { query } from "./query"

export const fetchWords = async (
  first: number,
  after?: string
): Promise<any | Error> => {
  const gqlQuery = after
    ? `query { words(first: ${first}, after: "${after}") { id value } }`
    : `query { words(first: ${first}) { id value } }`
  return query(gqlQuery, "words")
}
