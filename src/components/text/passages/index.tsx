import * as React from "react"
import styled from "styled-components"
import * as _ from "underscore"

import history from "../../../history"

import Box from "../../common/box"
import Icon from "../../common/icon"
import CommonText from "../../common/text"

import Edit from "./edit"

import { Passage, Text } from "../../../models/text"
import { Keywords } from "../../app"

import deleteIconRed from "../../../lib/images/icon-delete-red.png"
import deleteIcon from "../../../lib/images/icon-delete.png"
import passageIcon from "../../../lib/images/icon-passage.png"

import { highlight } from "../../../lib/helpers"

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
  color: string
}

const Span = styled.span`
  color: ${(p: SpanProps) => p.color};
`

interface Props {
  text: Text
  keywords?: Keywords
  removePassage: (textId: string, passageId: string) => {}
}

interface State {
  isHoveringDelete?: number
  isEditingPassageId?: string
}

class Passages extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public componentDidMount() {
    this.getPath()
  }

  public clickedPassage(textId: string, passageId: string) {
    history.push(textId + "/passage/" + passageId)
    this.getPath()
  }

  public getPath() {
    const pathname = window.location.pathname
    const isEditingPassageId =
      pathname.includes("passage/") && _.last(pathname.split("passage/"))
    if (isEditingPassageId) {
      this.setState({ isEditingPassageId })
    }
  }

  public render() {
    const { isHoveringDelete, isEditingPassageId } = this.state
    const { keywords, text } = this.props
    const { id, passages } = text

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

    const span = (word: string, idx: number) => (
      <Span color={highlight(word, keywords)} key={idx}>
        {word + " "}
      </Span>
    )

    const passage = (p: Passage, i: number) => (
      <Box.regular key={p.id}>
        {icons(p, i)}
        <CommonText.regular bold={true}>
          {p.startIdx} - {p.endIdx}
        </CommonText.regular>

        <CommonText.regular
          onClick={() => this.clickedPassage(id, p.id)}
          style={{ textAlign: "left", cursor: "pointer" }}
        >
          {(p.value || "")
            .split(" ")
            .map((w: string, idx: number) => span(w, idx))}
        </CommonText.regular>
      </Box.regular>
    )

    return (
      <Container>
        {isEditingPassageId ? (
          <Edit
            keywords={keywords}
            passage={
              _.find(passages, (p: Passage) => p.id === isEditingPassageId)!
            }
          />
        ) : (
          _
            .sortBy(passages, "startIdx")
            .map((p: Passage, i: number) => passage(p, i))
        )}
      </Container>
    )
  }
}

export default Passages
