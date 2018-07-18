import { query } from "./query"

export const loginUser = async (
  email: string,
  password: string
): Promise<any | Error> => {
  const gqlQuery = `mutation { loginUser(email: "${email}", password: "${password}") { email firstName lastName } }`
  return query(gqlQuery, "loginUser")
}
