import { CALL_API } from "../middleware/api"

import { userAttrs } from "../interfaces/user"
import { wordAttrs } from "../interfaces/concept"
import { encodeUri } from "../lib/helpers"

const queueAttrs =
  "id entity type createdOn accessLevel items { id tags decisions { indexes accepted id userId userAccessLevel } }"

const imageAttrs = "id url caption location wordValues firstWordValue"
const esPassageAttrs = "_id _source { sentences source title section }"

const taggedAttrs =
  "tagged { value pos isFocusWord isPunctuation isSentenceConnector isConnector isUnfocused wordId choiceSetId }"
const passageAttrs = `id factoidOnCorrect difficulty source title ${taggedAttrs}`

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

export const fetchTextAction = (id: string, route: string = "text") => (
  dispatch: any
) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route}(id: "${id}") { text { _id _source { title sections_count } } esPassage { _id _source { section sentences } } } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: ["text", "esPassage"],
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

export const fetchWordAction = (id: string, route: string = "word") => (
  dispatch: any
) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route}(id: "${id}") { word { ${wordAttrs} } images { ${imageAttrs} } } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: ["images", "word"],
      route
    }
  })

export const removeImageFromWordAction = (
  id: string,
  imageId: string,
  route: string = "removeImageFromWord"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `mutation { ${route}(id: "${id}", imageId: "${imageId}") { word { ${wordAttrs} } image { ${imageAttrs} } } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: ["word", "image"],
      route
    }
  })

export const updateWordAction = (update: any, route: string = "updateWord") => (
  dispatch: any
) =>
  dispatch({
    [CALL_API]: {
      query: `mutation { ${route}(word: "${encodeUri(
        update
      )}") { ${wordAttrs} } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "word",
      route
    }
  })

export const fetchImagesAction = (
  search: string = "",
  route: string = "images"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route}(search: "${search}") { ${imageAttrs} } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "images",
      route
    }
  })

export const findEsPassagesAction = (
  lcds: string[],
  route: string = "findEsPassages"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route}(lcds: "${lcds.join(
        ","
      )}") { _score highlight { sentences } ${esPassageAttrs} } }`,
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

export const fetchPassages = (route: string = "getPassages") => (
  dispatch: any
) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route} { ${passageAttrs} } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "passages",
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

export const fetchEsPassageBySectionAction = (
  index: string,
  id: string,
  section: number,
  route: string = "getEsPassageBySection"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route}(index: "${index}", id: "${id}", section: "${section}") { ${esPassageAttrs} } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "esPassage",
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

export const fetchCurriculaAction = (route: string = "curricula") => (
  dispatch: any
) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route} { id name createdOn } }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "curricula",
      route
    }
  })

export const createCurriculumAction = (
  name: string,
  route: string = "createCurriculum"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `mutation { ${route}(name: "${name}") { id } }`,
      types: types(camelCaseToUpperCase(route)),
      route
    }
  })

export const removeCurriculumAction = (
  id: string,
  route: string = "removeCurriculum"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `mutation { ${route}(id: "${id}") { id } }`,
      types: types(camelCaseToUpperCase(route)),
      route
    }
  })

export const findIndexCountsAction = (
  indexes: string[],
  route: string = "findIndexCounts"
) => (dispatch: any) =>
  dispatch({
    [CALL_API]: {
      query: `query { ${route}(indexes: "${indexes.join(",")}") }`,
      types: types(camelCaseToUpperCase(route)),
      schema: "indexCounts",
      route
    }
  })
