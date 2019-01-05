/* tslint:disable */

import { mergeWith, groupBy, transform, sortBy, last } from "lodash"

import * as _ from "underscore"
import { colors } from "./colors"

export const cleanObj = (obj: any) =>
  Object.keys(obj).forEach(k => {
    if (!obj[k]) {
      delete obj[k]
    }
  })

export const tagsToSentence = (tags: any[]) => {
  let sentence = ""
  tags.forEach((tag: any) => {
    const addSpace = !tag.isPunctuation && sentence.length !== 0
    sentence += addSpace ? ` ${tag.value}` : tag.value
  })
  return sentence
}

export const highlight = (word: any): string => {
  if (word.wordId) {
    return colors.warmYellow
  } else if (word.choiceSetId) {
    return colors.blue
  } else if (word.isFocusWord) {
    return colors.darkLimeGreen
  } else if (word.isConnector) {
    return colors.red
  }
  return "black"
}

export const isPunc = (char?: string): boolean =>
  char !== undefined && [".", ",", ")", "'"].indexOf(char) > -1

export const toSentences = (tags: any[]): any[][] => {
  const sentences: any[][] = [[]]
  let senIdx = 0
  tags.forEach((tag: any) => {
    if (tag.isSentenceConnector) {
      senIdx += 1
      sentences.push([])
    } else {
      sentences[senIdx].push(tag)
    }
  })
  return sentences
}

export const flattenSentences = (sentences: any[][]): any =>
  _.flatten(
    sentences
      .reduce((a, v) => [...a, v, { isSentenceConnector: true }], [])
      .slice(0, -1)
  )

export const parseQueryString = (queryString: string): any => {
  queryString = queryString.substring(1)

  var params = {},
    queries,
    temp,
    i,
    l

  queries = queryString.split("&")

  for (i = 0, l = queries.length; i < l; i++) {
    temp = queries[i].split("=")
    params[temp[0]] = temp[1]
  }

  return params
}

export const formatName = (first: string, last: string): string =>
  first.charAt(0).toUpperCase() +
  first.substr(1).toLowerCase() +
  " " +
  last.charAt(0).toUpperCase()

export const sleep = (s: number) =>
  new Promise(resolve => setTimeout(resolve, s * 1000))

// lodash/merge would not replace a non-empty list with an empty list
export const _mergeWith = (state: any, response: any) =>
  mergeWith(
    {},
    state,
    response,
    (srcValue: any, objValue: any, key: string): any => {
      if (Array.isArray(objValue)) {
        return objValue
      }
    }
  )

export const alphabetize = (data: any[], attr: string): any[] => {
  const none = "(none)".toUpperCase()
  const sorted = sortBy(data, d => (d[attr] || none).toUpperCase())
  const grouped = groupBy(sorted, x =>
    x[attr] === none
      ? none
      : parseInt(x[attr][0], 10)
      ? "0-9"
      : x[attr][0].toUpperCase()
  )
  return transform(
    grouped,
    (res: any[], v: any[], divider: string) => {
      res.push(...[{ divider }].concat(...v))
    },
    []
  )
}

export const encodeUri = (data: any) => encodeURIComponent(JSON.stringify(data))

export const lastPath = (window: Window): string =>
  last(window.location.pathname.split("/")) || ""

export const unixToDateString = (timestamp: string) =>
  new Date(parseInt(timestamp, 10)).toLocaleDateString()

export const cleanPageNumbers = (str: string) =>
  str
    .replace(/<page>.*?<\/page>/g, "")
    .replace("<page>", "")
    .replace("</page>", " ")
