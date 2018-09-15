import * as React from "react"
import styled from "styled-components"

import Header from "../common/header"
import Text from "../common/text"

import { DefinitionPart, Word } from "../../models/word"

import { colors } from "../../lib/colors"

interface SpanProps {
  highlight: boolean
}

const Span = styled.span`
  color: ${(p: SpanProps) => (p.highlight ? colors.warmYellow : colors.gray)};
  cursor: pointer;
`

const Textarea = styled.textarea`
  width: 100%;
  min-height: 50px;
  font-family: BrandonGrotesque;
  font-size: 1em;
  color: ${colors.gray};
  line-height: 28px;
  padding: 10px;
  box-sizing: border-box;
  margin-top: 20px;
`

interface Props {
  word: Word
  update: (word: Word) => void
}

class DefinitionComponent extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public edit(str: string) {
    const word = this.props.word
    word.definition = str.split(" ").map(v => ({ value: v, highlight: false }))
    this.props.update(word)
  }

  public highlight(i: number) {
    const word = this.props.word
    word.definition[i].highlight = !word.definition[i].highlight
    this.props.update(word)
  }

  public render() {
    const { word } = this.props

    return (
      <div style={{ marginTop: "30px" }}>
        <Header.s>definition</Header.s>

        <Text.l style={{ minHeight: "30px" }}>
          {word.definition.map((d: any, i: number) => (
            <Span
              onClick={() => this.highlight(i)}
              key={i}
              highlight={d.highlight}
            >
              {` ${d.value}`}
            </Span>
          ))}
        </Text.l>

        <Textarea
          spellCheck={false}
          onChange={e => this.edit(e.target.value)}
          value={word.definition.map((d: DefinitionPart) => d.value).join(" ")}
        />
      </div>
    )
  }
}

export default DefinitionComponent
