import { CALL_API } from "../middleware/api"

import { userAttrs } from "../interfaces/user"

import { encodeUri } from "../lib/helpers"

const queueAttrs =
  "id entity type createdOn accessLevel items { id tags decisions { indexes accepted id userId userAccessLevel } }"

const esPassageAttrs = "_id _source { sentences source title section }"

const taggedAttrs =
  "tagged { value pos isFocusWord isPunctuation isSentenceConnector isConnector isUnfocused wordId choiceSetId }"
const passageAttrs = `id factoidOnCorrect source title ${taggedAttrs}`

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

export const setEntity = (response: any) => (dispatch: any) =>
  dispatch({
    type: `SET_${camelCaseToUpperCase(Object.keys(response)[0])}`,
    response
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
      )}") { _score highlight { sentences } ${passageAttrs} } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "hits",
      route
    }
  })

export const fetchPassageAction = (
  id: string,
  route: string = "getPassage"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route}(id: "${id}") { ${passageAttrs} } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "passage",
      route
    }
  })

export const updatePassageAction = (
  id: string,
  update: string,
  route: string = "updatePassage"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `mutation { ${route}(id: "${id}", update: "${encodeUri(
        update
      )}") { ${passageAttrs} } }`,
      types: types(camelCaseToUpperCase(route)),
      route
    }
  })

export const fetchEsPassageAction = (
  id: string,
  route: string = "getEsPassage"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route}(id: "${id}") { ${esPassageAttrs} } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "passage",
      route
    }
  })

export const createQueueAction = (
  params: any,
  route: string = "createQueue"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `mutation { ${route}(data: "${encodeUri(params)}") }`,
      types: types(camelCaseToUpperCase(route)),
      route
    }
  })

export const updateQueueItemAction = (
  id: string,
  index: number,
  update: any,
  route: string = "updateQueueItem"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `mutation { ${route}(id: "${id}", index: "${index}", update: "${encodeUri(
        update
      )}") { ${queueAttrs} } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "queue",
      route
    }
  })

export const fetchQueuesAction = (route: string = "queues") => (
  dispatch: any
) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route} { ${queueAttrs} } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "queues",
      route
    }
  })

export const deleteQueueAction = (
  id: string,
  route: string = "deleteQueue"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `mutation { ${route}(id: "${id}") }`,
      types: types(camelCaseToUpperCase(route)),
      route
    }
  })

export const finishedQueue = (id: string, route: string = "finishedQueue") => (
  dispatch: any
) =>
  dispatch({
    [CALL_API]: {
      query: `mutation { ${route}(id: "${id}") }`,
      types: types(camelCaseToUpperCase(route)),
      route
    }
  })

export const fetchKeywords = (route: string = "keywords") => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route} }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "keywords",
      route,
      parseJson: true
    }
  })
