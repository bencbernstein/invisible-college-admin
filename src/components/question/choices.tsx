import * as _ from "underscore"
import * as React from "react"

import { Button, Image, ChoicesGridBox, ChoicesFlexBox } from "./components"
import { Guess } from "./"

import { AnswerPart } from "../../models/question"

import { colors } from "../../lib/colors"

interface Props {
  answer: AnswerPart[]
  redHerrings: string[]
  guess?: Guess
  isBetweenQuestions: boolean
  guessed: (choice: string, buttonIdx: number, answerValues: string[]) => void
  type: string
  flex: number
}

const disabledColor = (buttonIdx: number, g: Guess): string =>
  buttonIdx === g.buttonIdx
    ? g.correct
      ? colors.green
      : colors.red
    : colors.lightGray

export default class Choices extends React.Component<Props, any> {
  public render() {
    const {
      answer,
      guess,
      redHerrings,
      type,
      flex,
      isBetweenQuestions
    } = this.props

    const isImage =
      type === "Word to Image" && redHerrings[0].startsWith("data:image")

    const answerValues = _.compact(
      answer.filter(a => !a.prefill).map(a => a.value)
    )

    const choices = redHerrings
      .concat(answerValues)
      .map((c: string, i: number) => {
        const userGuessed = guess !== undefined
        const userGuessedCorrectly = userGuessed && guess!.correct
        const buttonGuessed = userGuessed && guess!.buttonIdx === i
        const disable =
          (userGuessed && !userGuessedCorrectly) ||
          (userGuessedCorrectly && buttonGuessed)
        const bColor = disable ? disabledColor(i, guess!) : colors.blue
        return isImage ? (
          <Image
            disabled={disable || isBetweenQuestions}
            backgroundColor={bColor}
            onClick={() => this.props.guessed(c, i, answerValues)}
            src={c}
            key={i}
          />
        ) : (
          <Button
            disabled={disable || isBetweenQuestions}
            backgroundColor={bColor}
            onClick={() => this.props.guessed(c, i, answerValues)}
            key={i}
          >
            {c}
          </Button>
        )
      })

    const Container = false ? ChoicesFlexBox : ChoicesGridBox

    return (
      <Container flex={flex} count={choices.length}>
        {choices}
      </Container>
    )
  }
}
