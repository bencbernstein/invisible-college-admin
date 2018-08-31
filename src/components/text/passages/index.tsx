import * as React from "react"
import styled from "styled-components"
import * as _ from "underscore"

import history from "../../../history"

import Box from "../../common/box"
import Icon from "../../common/icon"
import CommonText from "../../common/text"

import Edit from "./edit"

import { Passage, Tag, Text } from "../../../models/text"
import { Keywords } from "../../app"

import deleteIconRed from "../../../lib/images/icon-delete-red.png"
import deleteIcon from "../../../lib/images/icon-delete.png"
import passageIcon from "../../../lib/images/icon-passage.png"

import { highlight } from "../../../lib/helpers"

const Container = styled.div`
  text-align: center;
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
  tag: Tag
}

const Span = styled.span`
  color: ${(p: SpanProps) => p.color};
  text-decoration: ${(p: SpanProps) =>
    p.tag.isUnfocused
      ? "line-through"
      : p.tag.isFocusWord
        ? "underline"
        : "none"};
`

interface Props {
  text: Text
  isEnriching: boolean
  keywords?: Keywords
  removePassage: (textId: string, passageId: string) => {}
}

interface State {
  isHoveringDelete?: number
  isEditingPassageId?: string
  passagesToEnrich: string[]
}

class Passages extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      passagesToEnrich: []
    }
  }

  public componentDidMount() {
    this.checkIsEnriching(this.props)
  }

  public componentWillReceiveProps(nextProps: Props) {
    const showPassageList =
      !window.location.href.includes("/passage/") &&
      this.state.isEditingPassageId
    if (showPassageList) {
      this.setState({ isEditingPassageId: undefined })
    }
    this.checkIsEnriching(nextProps)
  }

  public checkIsEnriching(props: Props) {
    const passagesToEnrich = _.sortBy(
      props.text.passages.filter(p => !p.isEnriched),
      "startIdx"
    ).map(p => p.id)

    const next =
      this.props.isEnriching &&
      this.state.passagesToEnrich.length !== passagesToEnrich.length

    const done = passagesToEnrich.length === 0

    if (next) {
      if (done) {
        this.setState({ isEditingPassageId: undefined })
      } else {
        this.setState({ passagesToEnrich }, () =>
          this.editPassage(passagesToEnrich[0])
        )
      }
    }
  }

  public editPassage(isEditingPassageId: string) {
    const { isEnriching, text } = this.props

    const path =
      "/text/" +
      text.id +
      "/passage/" +
      isEditingPassageId +
      (isEnriching ? "?enriching=true" : "")

    history.push(path)
    this.setState({ isEditingPassageId })
  }

  public render() {
    const { isHoveringDelete, isEditingPassageId } = this.state
    const { keywords, text, isEnriching } = this.props
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

    const span = (tag: Tag, idx: number) => (
      <Span tag={tag} color={highlight(tag)} key={idx}>
        {tag.isPunctuation ? tag.value : ` ${tag.value}`}
      </Span>
    )

    const passage = (p: Passage, i: number) => (
      <Box.regular key={p.id}>
        {icons(p, i)}
        <CommonText.regular bold={true}>
          {p.startIdx} - {p.endIdx}
        </CommonText.regular>

        <CommonText.regular
          onClick={() => this.editPassage(p.id)}
          style={{ textAlign: "left", cursor: "pointer" }}
        >
          {_.flatten(p.tagged).map((tag: Tag, idx: number) => span(tag, idx))}
        </CommonText.regular>
      </Box.regular>
    )

    return (
      <Container>
        {isEditingPassageId ? (
          <Edit
            removePassage={passageId => this.props.removePassage(id, passageId)}
            isEnriching={isEnriching}
            keywords={keywords}
            passage={
              _.find(passages, (p: Passage) => p.id === isEditingPassageId)!
            }
          />
        ) : (
          _.sortBy(passages, "startIdx").map((p: Passage, i: number) =>
            passage(p, i)
          )
        )}
      </Container>
    )
  }
}

export default Passages
