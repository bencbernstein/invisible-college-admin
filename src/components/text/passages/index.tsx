import * as React from "react"
import styled from "styled-components"
import * as _ from "underscore"

import history from "../../../history"

import Box from "../../common/box"
import AddBox from "../../common/addBox"
import Icon from "../../common/icon"
import Input from "../../common/input"
import CommonText from "../../common/text"
import Header from "../../common/header"

import Edit from "./edit"

import { Passage, Tag, Text } from "../../../models/text"
import {
  PassageSequence,
  updatePassageSequence,
  fetchPassageSequences,
  addPassageToPassageSequence
} from "../../../models/passageSequence"
import { Keywords } from "../../app"

import deleteIcon from "../../../lib/images/icon-delete.png"
import passageIcon from "../../../lib/images/icon-passage.png"

import { highlight } from "../../../lib/helpers"
import { colors } from "../../../lib/colors"

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

const BottomText = CommonText.s.extend`
  position: absolute;
  bottom: 10px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: ${colors.red};
  }
`

interface SpanProps {
  color: string
  tag: Tag
  marginLeft: boolean
}

const Span = styled.span`
  display: inline-block;
  color: ${(p: SpanProps) => p.color};
  margin-left: ${(p: SpanProps) => (p.marginLeft ? "2.5px" : "0px")};
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
  isHovering?: number
  isEditingPassageId?: string
  passagesToEnrich: string[]
  passageSequences: PassageSequence[]
}

class Passages extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      passagesToEnrich: [],
      passageSequences: []
    }
  }

  public componentDidMount() {
    this.checkIsEnriching(this.props)
    this.loadPassageSequences()
  }

  public async loadPassageSequences() {
    const passageSequences = await fetchPassageSequences()
    if (!(passageSequences instanceof Error)) {
      this.setState({ passageSequences })
    }
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

  public async addToPassageSequence(passageId: string) {
    const passageSequence = this.state.passageSequences[0]
    const updated = await addPassageToPassageSequence(
      passageSequence.id,
      passageId
    )
    if (!(updated instanceof Error)) {
      this.setState({ passageSequences: [updated] })
    }
  }

  public removePassage(id: string) {
    const passageSequence = this.state.passageSequences[0]
    passageSequence.passages = _.without(passageSequence.passages, id)
    updatePassageSequence(passageSequence.id, passageSequence.passages)
    this.setState({ passageSequences: [passageSequence] })
  }

  public render() {
    const { isEditingPassageId, isHovering, passageSequences } = this.state
    const { keywords, text, isEnriching } = this.props
    const { id, passages } = text

    const icons = (p: Passage, i: number) => (
      <Icons>
        <Icon
          pointer={true}
          onClick={() => this.props.removePassage(id, p.id)}
          src={deleteIcon}
        />
        <Icon src={passageIcon} />
      </Icons>
    )

    const span = (tag: Tag, idx: number) => (
      <Span
        marginLeft={!tag.isPunctuation}
        tag={tag}
        color={highlight(tag)}
        key={idx}
      >
        {tag.value}
      </Span>
    )

    const inputBox = (passageId: string) => (
      <AddBox>
        <Header.forInput>Add to Passage Sequence</Header.forInput>

        <form
          onSubmit={e => {
            e.preventDefault()
            this.addToPassageSequence(passageId)
          }}
        >
          <Input.circ
            value={"Zoology Sequence"}
            readOnly={true}
            autoCapitalize={"none"}
            autoFocus={true}
            type="text"
          />
        </form>
      </AddBox>
    )

    // TODO: - remove once there are multiple sequences
    const seqIds = passageSequences.length ? passageSequences[0].passages : []

    const passage = (p: Passage, i: number) => {
      let seqIdx: number | undefined = _.findIndex(seqIds, idx => idx === p.id)
      seqIdx = seqIdx > -1 ? seqIdx + 1 : undefined

      return (
        <Box.regular
          onMouseEnter={() => this.setState({ isHovering: i })}
          onMouseLeave={() => this.setState({ isHovering: undefined })}
          key={p.id}
        >
          {icons(p, i)}
          <CommonText.regular bold={true}>
            {p.startIdx} - {p.endIdx}
          </CommonText.regular>

          <CommonText.regular
            onClick={() => this.editPassage(p.id)}
            style={{ textAlign: "left", cursor: "pointer" }}
          >
            {_.flatten(p.tagged).map(span)}
          </CommonText.regular>

          {seqIdx ? (
            <BottomText
              onClick={() => this.removePassage(p.id)}
            >{`Zoology passage no. ${seqIdx}`}</BottomText>
          ) : (
            isHovering === i && inputBox(p.id)
          )}
        </Box.regular>
      )
    }

    const editPassageComponent = (
      <Edit
        removePassage={passageId => this.props.removePassage(id, passageId)}
        isEnriching={isEnriching}
        keywords={keywords}
        passage={_.find(passages, (p: Passage) => p.id === isEditingPassageId)!}
        passageSequences={passageSequences}
      />
    )

    const passagesListComponent = _.sortBy(passages, "startIdx").map(
      (p: Passage, i: number) => passage(p, i)
    )

    return (
      <Container>
        {isEditingPassageId ? editPassageComponent : passagesListComponent}
      </Container>
    )
  }
}

export default Passages
