import * as React from "react"
import styled from "styled-components"

import Header from "../common/header"
import Text from "../common/text"

import { colors } from "../../lib/colors"

interface Props {
  word: any
}

const Interpunct = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 5px;
  margin: 0px 4px;
  background-color: ${colors.gray};
`

const ComponentText = Text.l.extend`
  display: flex;
  align-items: center;
`

interface SpanProps {
  highlight: boolean
}

const Span = styled.span`
  color: ${(p: SpanProps) => (p.highlight ? colors.warmYellow : colors.gray)};
`

class RootsComponent extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public render() {
    const { word } = this.props

    if (!word.isDecomposable || !word.components) {
      return null
    }

    return (
      <div>
        <Header.s>components</Header.s>
        <ComponentText>
          {word
            .components!.map(
              (c: any, i: number): any => (
                <Span key={c.value} highlight={c.isRoot}>
                  {c.value}
                </Span>
              )
            )
            .reduce((prev: any, curr: any, i: number) => [
              prev,
              <Interpunct key={i} />,
              curr
            ])}
        </ComponentText>
      </div>
    )
  }
}

export default RootsComponent
