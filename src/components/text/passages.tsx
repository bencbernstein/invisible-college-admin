import * as React from "react"
import styled from "styled-components"

import Box from "../common/box"
import Icon from "../common/icon"
import Text from "../common/text"

import { colors } from "../../lib/colors"
import { Passage, TextDoc } from "./"

import deleteIconRed from "../../lib/images/icon-delete-red.png"
import deleteIcon from "../../lib/images/icon-delete.png"
import passageIcon from "../../lib/images/icon-passage.png"

const Container = styled.div`
  text-align: center;
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 25px 0px;
`

const Icons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 5px;
  width: 100%;
  padding: 0px 5px;
  box-sizing: border-box;
`

interface SpanProps {
  highlight: boolean
}

const Span = styled.span`
  color: ${(p: SpanProps) => (p.highlight ? colors.blue : colors.gray)};
`

interface Props {
  text: TextDoc
  removePassage: (textId: string, passageId: string) => {}
}

interface State {
  isHoveringDelete?: number
}

class Passages extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public render() {
    const { isHoveringDelete } = this.state
    const { id, passages } = this.props.text

    const icons = (p: Passage, i: number) => (
      <Icons>
        <Icon
          pointer={true}
          onMouseEnter={() => this.setState({ isHoveringDelete: i })}
          onMouseLeave={() => this.setState({ isHoveringDelete: undefined })}
          onClick={() => this.props.removePassage(id, p.id)}
          src={isHoveringDelete === i ? deleteIconRed : deleteIcon}
        />
        <Icon src={passageIcon} />
      </Icons>
    )

    const span = (word: string, found: string[], idx: number) => (
      <Span highlight={found.indexOf(word) > -1} key={idx}>
        {word + " "}
      </Span>
    )

    const passage = (p: Passage, i: number) => (
      <Box.regular key={p.id}>
        {icons(p, i)}
        <Text.regular bold={true}>
          {p.startIdx} - {p.endIdx}
        </Text.regular>
        <Text.regular style={{ textAlign: "left" }}>
          {p.passage
            .split(" ")
            .map((w: string, idx: number) => span(w, p.found, idx))}
        </Text.regular>
      </Box.regular>
    )

    return (
      <Container>
        {passages.map((p: Passage, i: number) => passage(p, i))}
      </Container>
    )
  }
}

export default Passages
