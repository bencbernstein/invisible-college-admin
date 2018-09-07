import * as _ from "underscore"
import * as React from "react"
import styled from "styled-components"

import Text from "../common/text"

import { PromptPart } from "../../models/question"
import { colors } from "../../lib/colors"

import { isPunc } from "../../lib/helpers"

const Container = styled.div`
  height: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 5%;
`

interface SpanProps {
  highlight?: boolean
}

const Span = styled.span`
  color: ${(p: SpanProps) => (p.highlight ? colors.warmYellow : colors.black)};
  font-family: ${(p: SpanProps) => p.highlight && "BrandonGrotesqueBold"};
`

const Image = styled.img`
  max-height: 100%;
`

const Underline = styled.div`
  width: 100px;
  height: 4px;
  background-color: black;
  display: inline-block;
  bottom: 0;
  margin: 0px 10px;
  border-radius: 5px;
`

interface Props {
  prompt: PromptPart[]
  type: string
}

export default class Prompt extends React.Component<Props, any> {
  public render() {
    const { prompt, type } = this.props

    const span = (p: PromptPart, i: number) =>
      p.value === "_underline_" ? (
        <Underline />
      ) : (
        <Span key={i} highlight={p.highlight}>
          {isPunc(p.value) ? p.value : ` ${p.value || ""}`}
        </Span>
      )

    const isImage =
      type === "WORD_TO_IMG" &&
      _.isString(prompt[0].value) &&
      prompt[0].value!.startsWith("data:image")

    const length = prompt.map(p => p.value).join("").length
    const TextForSize = length < 50 ? Text.xl : Text.l

    const promptComponent = isImage ? (
      <Image src={prompt[0].value} />
    ) : (
      <TextForSize>
        {prompt.map((p: PromptPart, i: number) => span(p, i))}
      </TextForSize>
    )

    return <Container>{promptComponent}</Container>
  }
}
