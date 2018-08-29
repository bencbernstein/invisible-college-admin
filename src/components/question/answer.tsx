import * as React from "react"
import * as _ from "underscore"
import styled from "styled-components"

import Text from "../common/text"

import { AnswerPart } from "../../models/question"
import { isPunc } from "../../lib/helpers"

interface ContainerProps {
  height: string
}

const Container = styled.div`
  height: ${(p: ContainerProps) => p.height};
  display: flex;
  align-items: center;
  justify-content: center;
`

interface AnswerSpaceProps {
  hide: boolean
}

const AnswerSpace = styled.span`
  color: ${(p: AnswerSpaceProps) => (p.hide ? "white" : "black")};
  display: ${(p: AnswerSpaceProps) => p.hide && "inline-block"};
`

const Underline = styled.div`
  height: 4px;
  background-color: black;
  border-radius: 5px;
`

const Image = styled.img`
  max-height: 65%;
`

const AnswerText = Text.xl.extend`
  color: black;
`

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
      answer[0].value.startsWith("data:image") &&
      guessedCorrectly.length

    const withUnderline = (value: string) => (
      <span
        style={{ display: "flex", flexDirection: "column", margin: "0px 10px" }}
      >
        {value}
        <Underline />
      </span>
    )

    const answerSpace = (part: AnswerPart, i: number) => {
      const hide = !part.prefill && !_.includes(guessedCorrectly, part.value)
      const formattedValue = isPunc(part.value) ? part.value : ` ${part.value}`
      return (
        <AnswerSpace hide={hide} key={i}>
          {hide ? withUnderline(formattedValue) : formattedValue}
        </AnswerSpace>
      )
    }

    const answerComponent = displayImage ? (
      <Image src={answer[0].value} />
    ) : (
      <AnswerText>{answer.map((a, i) => answerSpace(a, i))}</AnswerText>
    )

    return <Container height={height}>{answerComponent}</Container>
  }
}
