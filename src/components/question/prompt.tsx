import * as React from "react"
import styled from "styled-components"

import Text from "../common/text"

import { PromptPart } from "../../models/question"
import { colors } from "../../lib/colors"

const Container = styled.div`
  height: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
`

interface SpanProps {
  highlight: boolean
}

const Span = styled.span`
  color: ${(p: SpanProps) => (p.highlight ? colors.warmYellow : colors.black)};
`

const Image = styled.img`
  max-height: 65%;
`

interface Props {
  prompt: PromptPart[]
  type: string
}

export default class Prompt extends React.Component<Props, any> {
  public render() {
    const {
      prompt,
      type
    } = this.props

    const span = (p: PromptPart, i: number) => (
      <Span key={i} highlight={p.highlight}>{p.value + " "}</Span>
    )

    const isImage = type === "WORD_TO_IMG" && prompt[0].value.startsWith("data:image")

    const promptComponent = isImage
      ? <Image src={prompt[0].value} />
      : <Text.l>
        {prompt.map((p: PromptPart, i: number) => span(p, i))}
      </Text.l>

    return (
      <Container>
        {promptComponent}
      </Container>
    )
  }
}
