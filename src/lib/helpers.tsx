/* tslint:disable */

import { colors } from "./colors"
import { Tag } from "../models/text"

export const cleanObj = (obj: any) =>
  Object.keys(obj).forEach(k => {
    if (!obj[k]) {
      delete obj[k]
    }
  })

export const tagsToSentence = (tags: Tag[]) => {
  let sentence = ""
  tags.forEach((tag: Tag) => {
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
): string | null => {
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
  return null
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

export const isPunc = (char: string) => [".", ",", ")", "'"].indexOf(char) > -1
