import * as React from "react"
import styled from "styled-components"
import * as _ from "underscore"

import {
  fetchPassageSequence,
  updatePassageSequence
} from "../../models/passageSequence"
import { Passage, Tag } from "../../models/text"

import Subnav from "../nav/subnav"

import AddBox from "../common/addBox"
import Box from "../common/box"
import Icon from "../common/icon"
import IconsContainer from "../common/iconsContainer"
import Input from "../common/input"
import Header from "../common/header"
import ListContainer from "../common/listContainer"
import Text from "../common/text"

import deleteIcon from "../../lib/images/icon-delete.png"
import passageSequenceIcon from "../../lib/images/icon-passage-sequence.png"

import { highlight, move, toSentences } from "../../lib/helpers"

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

const BottomText = Text.s.extend`
  position: absolute;
  bottom: 10px;
`

interface State {
  id: string
  passages: Passage[]
  isHovering?: number
  indexInput?: number
}

class Sequence extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      passages: [],
      id: ""
    }
  }

  public componentDidMount() {
    this.loadPassageSequence()
  }

  public async loadPassageSequence() {
    const id = _.last(window.location.pathname.split("/"))!
    const passages = await fetchPassageSequence(id)
    if (!(passages instanceof Error)) {
      passages.forEach(p => (p.sentences = toSentences(p.tagged)))
      this.setState({ passages, id })
    }
  }

  public remove(id: string) {
    const passages = this.state.passages.filter(p => p.id !== id)
    updatePassageSequence(this.state.id, passages.map(p => p.id))
    this.setState({ passages })
  }

  public changeIndex(idx: number, indexInput?: number) {
    if (indexInput) {
      const passages = move(this.state.passages, idx, indexInput - 1)
      updatePassageSequence(this.state.id, passages.map(p => p.id))
      this.setState({ passages })
    }
  }

  public handleIndexInput(i: number, indexInput?: number) {
    const valid =
      indexInput &&
      indexInput !== i + 1 &&
      indexInput > 0 &&
      indexInput <= this.state.passages.length
    this.setState({ indexInput: valid ? indexInput : undefined })
  }

  public render() {
    const { passages, isHovering, indexInput } = this.state

    const icons = (id: string) => (
      <IconsContainer>
        <Icon pointer={true} onClick={() => this.remove(id)} src={deleteIcon} />
        <Icon src={passageSequenceIcon} />
      </IconsContainer>
    )

    const addBox = (i: number) => (
      <AddBox key={i}>
        <Header.forInput>Change Index</Header.forInput>

        <form
          onSubmit={e => {
            e.preventDefault()
            this.changeIndex(i, indexInput)
          }}
        >
          <Input.circ
            onChange={e => {
              e.preventDefault()
              this.handleIndexInput(i, parseInt(e.target.value, 10))
            }}
            value={indexInput || ""}
            autoCapitalize={"none"}
            autoFocus={true}
            type="text"
          />
        </form>
      </AddBox>
    )

    const span = (tag: Tag, i: number) => (
      <Span
        marginLeft={!tag.isPunctuation}
        tag={tag}
        color={highlight(tag)}
        key={i}
      >
        {tag.value}
      </Span>
    )

    const box = (data: Passage, idx: number) => (
      <Box.regular
        onMouseOver={() => this.setState({ isHovering: idx })}
        onMouseLeave={() =>
          this.setState({ isHovering: undefined, indexInput: undefined })
        }
        key={data.id}
      >
        {icons(data.id)}
        <Text.regular>
          {_.flatten(
            data.sentences.filter((tags: Tag[], i: number) =>
              _.includes(data.filteredSentences, i)
            )
          ).map(span)}
        </Text.regular>
        <BottomText>{`no. ${idx + 1}`}</BottomText>
        {isHovering === idx && addBox(idx)}
      </Box.regular>
    )

    return (
      <div>
        <Subnav
          minimized={false}
          title={"Zoology"}
          subtitle={"Passage Sequences"}
          subtitleLink={"/library?view=passage-sequences"}
          invert={true}
        />
        <ListContainer>{passages.map(box)}</ListContainer>
      </div>
    )
  }
}

export default Sequence
