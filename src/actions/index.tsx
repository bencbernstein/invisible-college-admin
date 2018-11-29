import { CALL_API } from "../middleware/api"

import { User, userAttrs } from "../interfaces/user"

const camelCaseToUpperCase = (str: string) =>
  str.replace(/([A-Z])/g, $1 => "_" + $1).toUpperCase()

const types = (str: string) => [
  `${str}_REQUEST`,
  `${str}_SUCCESS`,
  `${str}_FAILURE`
]

export const loginUserAction = (
  email: string,
  password: string,
  route: string = "loginUser"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `mutation { ${route}(email: "${email}", password: "${password}") { ${userAttrs} } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "user",
      route
    }
  })

export const setUserAction = (user: User) => (dispatch: any) =>
  dispatch({
    type: "SET_USER",
    response: { user }
  })

export const setIsLoading = (isLoading: boolean) => (dispatch: any) =>
  dispatch({
    type: "SET_IS_LOADING",
    response: { isLoading }
  })

export const setSearchQuery = (searchQuery: string) => (dispatch: any) =>
  dispatch({
    type: "SET_SEARCH_QUERY",
    response: { searchQuery }
  })

export const setCollectionAction = (collection: string) => (dispatch: any) =>
  dispatch({
    type: "SET_COLLECTION",
    response: { collection }
  })

export const fetchTextsAction = (
  index: string,
  search: string = "",
  route: string = "texts"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route}(index: "${index.replace(
        /-/g,
        "_"
      )}", search: "${search}") { id title } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "texts",
      route
    }
  })

export const fetchWordsByValuesAction = (
  values: string[],
  route: string = "wordsByValues"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route}(values: "${values.join(
        ","
      )}") { id value lcd } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "words",
      route
    }
  })

export const fetchWordsAction = (route: string = "words") => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route}{ id value } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "words",
      route
    }
  })

export const fetchImagesAction = (
  search: string = "",
  route: string = "images"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route}(search: "${search}") { id url wordValues firstWordValue } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "images",
      route
    }
  })

export const findPassagesAction = (
  lcds: string[],
  route: string = "findPassages"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route}(lcds: "${lcds.join(
        ","
      )}") { _id _score _source { sentences source title section } highlight { sentences } } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "hits",
      route
    }
  })

export const createQueueAction = (
  params: any,
  route: string = "createQueue"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `mutation { ${route}(data: "${encodeURIComponent(
        JSON.stringify(params)
      )}") }`,
      types: types(camelCaseToUpperCase(route)),
      route
    }
  })

export const fetchQueuesAction = (route: string = "queues") => (
  dispatch: any
) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route} { entity type items { id matches } } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "queues",
      route
    }
  })
