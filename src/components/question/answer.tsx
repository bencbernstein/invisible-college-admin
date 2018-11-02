import * as React from "react"
import * as _ from "underscore"

import {
  AnswerBox,
  AnswerText,
  AnswerPartBox,
  AnswerUnderline
} from "./components"

import { AnswerPart } from "../../models/question"

import { isPunc } from "../../lib/helpers"
import { colors } from "../../lib/colors"

interface Props {
  answer: AnswerPart[]
  type: string
  height: string
  guessedCorrectly: string[]
  isBetweenQuestions?: boolean
  flex: number
}

interface State {
  margin: number
}

export default class Answer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      margin: 3
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { isBetweenQuestions } = nextProps
    if (isBetweenQuestions !== this.props.isBetweenQuestions) {
      const margin = isBetweenQuestions ? -2 : 3
      this.setState({ margin })
    }
  }

  public render() {
    const {
      answer,
      type,
      guessedCorrectly,
      height,
      flex,
      isBetweenQuestions
    } = this.props

    const displayImage =
      type === "WORD_TO_IMG" &&
      _.isString(answer[0].value) &&
      answer[0].value!.startsWith("data:image") &&
      guessedCorrectly.length

    const answerSpace = (part: AnswerPart, i: number) => {
      if (!part.value) {
        return null
      }

      const hide = !part.prefill && !_.includes(guessedCorrectly, part.value)
      const formattedValue = isPunc(part.value) ? part.value : ` ${part.value}`
      const color = isBetweenQuestions
        ? colors.warmYellow
        : hide
          ? "black"
          : colors.green

      return (
        <AnswerPartBox margin={this.state.margin} key={i} hide={hide}>
          {formattedValue}
          <AnswerUnderline color={color} />
        </AnswerPartBox>
      )
    }

    const answerComponent = displayImage ? (
      <img style={{ maxHeight: "65%" }} src={answer[0].value} />
    ) : (
      <AnswerText color="black">
        {answer.map((a, i) => answerSpace(a, i))}
      </AnswerText>
    )

    return (
      <AnswerBox flex={flex} height={height}>
        {answerComponent}
      </AnswerBox>
    )
  }
}
