import * as React from "react"
import styled from "styled-components"

import { colors } from "../../lib/colors"

import { AnswerPart } from "../../models/question"

import { Guess } from "./"

interface ContainerProps {
  count: number
}

const templateForCount = (count: number) =>
  ({
    2: "1fr 1fr",
    6: "1fr 1fr 1fr"
  }[count] || "1fr 1fr 1fr")

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: ${(p: ContainerProps) => "center"};
  align-items: center;
  height: 40%;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${(p: ContainerProps) => templateForCount(p.count)};
  height: 40%;
  justify-items: center;
  align-items: center;
`

interface ChoiceProps {
  disabled: boolean
  backgroundColor: string
}

const Button = styled.p`
  pointer-events: ${(p: ChoiceProps) => (p.disabled ? "none" : "auto")};
  background-color: ${(p: ChoiceProps) => p.backgroundColor};
  font-size: 1.1em;
  color: white;
  border-radius: 10px;
  padding: 10px 20px;
  margin: 10px;
  min-width: 100px;
  text-align: center
  cursor: pointer;
`

const Image = styled.img`
  pointer-events: ${(p: ChoiceProps) => (p.disabled ? "none" : "auto")};
  border: 3px solid ${(p: ChoiceProps) => p.backgroundColor};
  max-height: 150px;
  max-width: 150px;
  margin: 10px;
  cursor: pointer;
`

interface Props {
  answer: AnswerPart[]
  redHerrings: string[]
  guess?: Guess
  guessed: (choice: string, buttonIdx: number, answerValues: string[]) => void
  type: string
}

const disabledColor = (buttonIdx: number, g: Guess): string =>
  buttonIdx === g.buttonIdx
    ? g.correct
      ? colors.green
      : colors.red
    : colors.lightGray

export default class Choices extends React.Component<Props, any> {
  public render() {
    const { answer, guess, redHerrings, type } = this.props

    const isImage =
      type === "WORD_TO_IMG" && redHerrings[0].startsWith("data:image")

    const answerValues = answer.filter(a => !a.prefill).map(a => a.value)

    const choices = redHerrings.concat(answerValues).map(
      (c: string, i: number) =>
        isImage ? (
          <Image
            disabled={guess !== undefined}
            backgroundColor={guess ? disabledColor(i, guess) : colors.blue}
            onClick={() => this.props.guessed(c, i, answerValues)}
            src={c}
            key={i}
          />
        ) : (
          <Button
            disabled={guess !== undefined}
            backgroundColor={guess ? disabledColor(i, guess) : colors.blue}
            onClick={() => this.props.guessed(c, i, answerValues)}
            key={i}
          >
            {c}
          </Button>
        )
    )

    const Container = false ? FlexContainer : GridContainer

    return <Container count={choices.length}>{choices}</Container>
  }
}
