import * as React from "react"
import * as _ from "underscore"

import Text from "../common/text"
import { AnswerBox, AnswerSpace, AnswerUnderline } from "./components"

import { AnswerPart } from "../../models/question"

import { isPunc } from "../../lib/helpers"

interface Props {
  answer: AnswerPart[]
  type: string
  height: string
  guessedCorrectly: string[]
}

export default class Answer extends React.Component<Props, any> {
  public render() {
    const { answer, type, guessedCorrectly, height } = this.props

    const displayImage =
      type === "WORD_TO_IMG" &&
      _.isString(answer[0].value) &&
      answer[0].value!.startsWith("data:image") &&
      guessedCorrectly.length

    const withUnderline = (value: string) => (
      <span
        style={{ display: "flex", flexDirection: "column", margin: "0px 10px" }}
      >
        {value}
        <AnswerUnderline />
      </span>
    )

    const answerSpace = (part: AnswerPart, i: number) => {
      const hide = !part.prefill && !_.includes(guessedCorrectly, part.value)

      if (!part.value) {
        return null
      }

      const formattedValue = isPunc(part.value) ? part.value : ` ${part.value}`

      return (
        <AnswerSpace hide={hide} key={i}>
          {hide ? withUnderline(formattedValue) : formattedValue}
        </AnswerSpace>
      )
    }

    const answerComponent = displayImage ? (
      <img style={{ maxHeight: "65%" }} src={answer[0].value} />
    ) : (
      <Text.xl color="black">{answer.map((a, i) => answerSpace(a, i))}</Text.xl>
    )

    return <AnswerBox height={height}>{answerComponent}</AnswerBox>
  }
}
