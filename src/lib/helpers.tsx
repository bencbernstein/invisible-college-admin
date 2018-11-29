/* tslint:disable */

import { mergeWith, groupBy, transform, sortBy } from "lodash"

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

export const highlightValue = (
  word: string,
  words: any,
  choices: any
): string => {
  word = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase()
  if (words[word]) {
    return colors.warmYellow
  } else if (choices[word]) {
    return colors.blue
  }
  return "black"
}

export const getRanges = (array: number[]): number[][] => {
  array = array.sort()
  const ranges = []
  let rstart
  let rend

  for (let i = 0; i < array.length; i++) {
    rstart = array[i]
    rend = rstart
    while (array[i + 1] - array[i] === 1) {
      rend = array[i + 1]
      i++
    }

    const result = rstart === rend ? [rstart, rstart + 1] : [rstart, rend + 1]
    ranges.push(result)
  }

  return ranges
}

export const getWordAtPoint = (
  elem: any,
  x: number,
  y: number
): string | undefined => {
  if (elem.nodeType === elem.TEXT_NODE) {
    const range = elem.ownerDocument.createRange()
    range.selectNodeContents(elem)
    let currentPos = 0
    const endPos = range.endOffset
    while (currentPos + 1 < endPos) {
      range.setStart(elem, currentPos)
      range.setEnd(elem, currentPos + 1)
      if (
        range.getBoundingClientRect().left <= (x || 0) &&
        range.getBoundingClientRect().right >= (x || 0) &&
        range.getBoundingClientRect().top <= (y || 0) &&
        range.getBoundingClientRect().bottom >= (y || 0)
      ) {
        range.expand("word")
        const ret = range.toString()
        range.detach()
        return ret
      }
      currentPos += 1
    }
  } else {
    for (let i = 0; i < elem.childNodes.length; i++) {
      let range = elem.childNodes[i].ownerDocument.createRange()
      range.selectNodeContents(elem.childNodes[i])
      if (
        range.getBoundingClientRect().left <= (x || 0) &&
        range.getBoundingClientRect().right >= (x || 0) &&
        range.getBoundingClientRect().top <= (y || 0) &&
        range.getBoundingClientRect().bottom >= (y || 0)
      ) {
        range.detach()
        return getWordAtPoint(elem.childNodes[i], x, y)
      } else {
        range.detach()
      }
    }
  }
  return undefined
}

export const move = (arr: any[], old_index: number, new_index: number) => {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
  return arr
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

export const camelize = (str: string) =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase()
    })
    .replace(/\s+/g, "")

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

export const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1)

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
  const sorted = sortBy(data, d => d[attr].toUpperCase())
  const grouped = groupBy(sorted, x =>
    parseInt(x[attr][0], 10) ? "0-9" : x[attr][0].toUpperCase()
  )
  return transform(
    grouped,
    (res: any[], v: any[], divider: string) => {
      res.push(...[{ divider }].concat(...v))
    },
    []
  )
}
