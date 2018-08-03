import * as React from "react"
import * as _ from "underscore"
import styled from "styled-components"

import Text from "../common/text"

import { AnswerPart } from "../../models/question"
// import { colors } from "../../lib/colors"

const Container = styled.div`
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: center;  
`

const AnswerSpace = styled.div`
  text-align: center;
  margin: 0px 10px;
`

const Underline = styled.div`
  height: 5px;
  border-radius: 10px;
  margin: 0px -5px;
  background-color: black;
`

const Image = styled.img`
  max-height: 65%;
`

interface AnswerTextProps {
  hide: boolean
}

const AnswerText = Text.xl.extend`
  color: black;
  opacity: ${(p: AnswerTextProps) => p.hide ? "0" : "1"};
`

interface Props {
  answer: AnswerPart[]
  type: string
  guessedCorrectly: string[]
}

export default class Answer extends React.Component<Props, any> {
  public render() {
    const { answer, type, guessedCorrectly } = this.props

    const useUnderline = type === "WORD_TO_ROOTS"

    const displayImage =
      type === "WORD_TO_IMG" &&
      answer[0].value.startsWith("data:image") &&
      guessedCorrectly.length

    const answerSpace = (part: AnswerPart, i: number) => <AnswerSpace key={i}>
      <AnswerText hide={!part.prefill && !_.includes(guessedCorrectly, part.value)}>
        {part.value}
      </AnswerText>
      {useUnderline && <Underline />}
    </AnswerSpace>

    const answerComponent = displayImage
      ? <Image src={answer[0].value} />
      : answer.map((a, i) => answerSpace(a, i))

    return (
      <Container>
        {answerComponent}
      </Container>
    )
  }
}
