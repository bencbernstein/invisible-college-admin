import * as React from "react"
import { compact, shuffle } from "lodash"

import { Button, Image, ChoicesGridBox, ChoicesFlexBox } from "./components"
import { Guess } from "./"

import { AnswerPart } from "../../interfaces/question"

import { colors } from "../../lib/colors"

interface Props {
  answer: AnswerPart[]
  redHerrings: string[]
  guess?: Guess
  isBetweenQuestions?: boolean
  guessed: (choice: string, buttonIdx: number, answerValues: string[]) => void
  type: string
  id: string
  flex: number
}

interface State {
  answerValues: string[]
  choices: string[]
}

const disabledColor = (buttonIdx: number, g: Guess): string =>
  buttonIdx === g.buttonIdx
    ? g.correct
      ? colors.green
      : colors.red
    : colors.lightGray

export default class Choices extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      choices: [],
      answerValues: []
    }
  }

  public componentDidMount() {
    this.setData(this.props)
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.id !== nextProps.id) {
      this.setData(nextProps)
    }
  }

  private setData(props: Props) {
    const answerValues = compact(
      props.answer.filter(a => !a.prefill).map(a => a.value)
    )
    const choices = shuffle(props.redHerrings.concat(answerValues))
    this.setState({ choices, answerValues })
  }

  public render() {
    const { choices, answerValues } = this.state
    const { guess, redHerrings, type, flex, isBetweenQuestions } = this.props

    const isSpell = type.indexOf("Chars") > -1

    const isImage =
      type === "Word to Image" && redHerrings[0].startsWith("data:image")

    const choiceComponent = (choice: string, i: number) => {
      const userGuessed = guess !== undefined
      const userGuessedCorrectly = userGuessed && guess!.correct
      const buttonGuessed = userGuessed && guess!.buttonIdx === i
      const disable =
        (userGuessed && !userGuessedCorrectly) ||
        (userGuessedCorrectly && buttonGuessed)
      const bColor = disable ? disabledColor(i, guess!) : colors.blue
      return isImage ? (
        <Image
          disabled={disable || isBetweenQuestions === true}
          backgroundColor={bColor}
          onClick={() => this.props.guessed(choice, i, answerValues)}
          src={choice}
          key={i}
        />
      ) : (
        <Button
          isSpell={isSpell}
          disabled={disable || isBetweenQuestions === true}
          backgroundColor={bColor}
          onClick={() => this.props.guessed(choice, i, answerValues)}
          key={i}
        >
          {choice}
        </Button>
      )
    }

    const Container = false ? ChoicesFlexBox : ChoicesGridBox

    return (
      <Container flex={flex} count={choices.length}>
        {choices.map(choiceComponent)}
      </Container>
    )
  }
}
